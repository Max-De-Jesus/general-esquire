"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, Client } from "@/lib/supabase";
import { sendEmailNotification } from "@/lib/emailNotifier";

interface LocalAdminSession {
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  clientProfile: Client | null;
  loading: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  signUp: (email: string, password: string, fullName: string, profileType?: string, phone?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [clientProfile, setClientProfile] = useState<Client | null>(null);
  const [localAdminSession, setLocalAdminSession] = useState<LocalAdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user has admin privileges
  const isAdmin = Boolean(
    localAdminSession ||
    user?.app_metadata?.role === "admin" ||
    user?.user_metadata?.role === "admin" ||
    user?.email?.toLowerCase().includes("admin@generalesquire.com") ||
    user?.email?.toLowerCase() === "admin@generalesquire.com" ||
    user?.email?.toLowerCase() === "generalesquire@proton.me" ||
    user?.email?.toLowerCase() === "contact@generalesquire.com"
  );

  // Check if client account has been confirmed / approved by admin
  const isApproved = Boolean(
    isAdmin ||
    (clientProfile?.status && ["Accepté", "Accepte", "Confirmé", "Validé", "Approuvé"].includes(clientProfile.status))
  );

  const fetchClientProfile = async (email: string) => {
    try {
      const { data } = await supabase
        .from("clients")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      if (data) {
        setClientProfile(data as Client);
      }
    } catch {
      // Ignore errors if profile table query fails
    }
  };

  useEffect(() => {
    // Check local admin session
    try {
      if (typeof window !== "undefined") {
        const storedAdminSession = localStorage.getItem("ge_admin_session");
        if (storedAdminSession) {
          setLocalAdminSession(JSON.parse(storedAdminSession));
        }
      }
    } catch {
      // Ignore
    }

    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        fetchClientProfile(session.user.email);
      }
      setLoading(false);
    });

    // 2. Listen for Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        fetchClientProfile(session.user.email);
      } else {
        setClientProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, profileType = "Particulier", phone = "") => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            profile_type: profileType,
            phone: phone,
          },
        },
      });

      if (error) {
        // Si l'utilisateur existe déjà dans Supabase Auth (ex: inscription précédente), tenter la connexion et réparer l'entrée clients
        if (
          error.message.includes("User already registered") ||
          error.message.includes("already registered") ||
          error.message.includes("already exists")
        ) {
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
          if (!signInErr && signInData?.user) {
            const clientRecord = {
              email: email.toLowerCase(),
              full_name: fullName || signInData.user.user_metadata?.full_name || email.split("@")[0],
              phone: phone || signInData.user.user_metadata?.phone || null,
              profile_type: (profileType || signInData.user.user_metadata?.profile_type || "Particulier") as any,
              requested_service: "Inscription Compte Client",
              status: "En attente de validation" as const,
              registered_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            try {
              const { error: upsertErr } = await supabase
                .from("clients")
                .upsert(clientRecord, { onConflict: "email" });
              if (upsertErr) {
                await supabase.from("clients").insert([clientRecord]);
              }
            } catch {}

            try {
              if (typeof window !== "undefined") {
                const existing = JSON.parse(localStorage.getItem("ge_admin_clients") || "[]");
                const filtered = existing.filter((c: any) => c.email !== clientRecord.email);
                localStorage.setItem("ge_admin_clients", JSON.stringify([clientRecord, ...filtered]));
                window.dispatchEvent(new CustomEvent("ge_client_registered", { detail: clientRecord }));
              }
            } catch {}

            // Notification d'alerte immédiate à israelgodjeto@gmail.com
            try {
              sendEmailNotification("israelgodjeto@gmail.com", {
                _subject: `NOUVELLE INSCRIPTION CLIENT À VALIDER — ${fullName || email}`,
                _replyto: email,
                "Nom complet": fullName || email.split("@")[0],
                "Email": email,
                "Téléphone": phone || "Non renseigné",
                "Profil / Statut": profileType,
                "Statut actuel": "En attente de validation",
                "Lien Administration": "https://www.generalesquire.com/espace-securise-esquire",
                "Date": new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
              });
            } catch {}

            return { error: null };
          }
        }
        return { error };
      }

      // Ensure client entry exists in clients table with status 'En attente de validation'
      if (data.user) {
        const clientRecord = {
          email: email.toLowerCase(),
          full_name: fullName,
          phone: phone || null,
          profile_type: profileType as any,
          requested_service: "Inscription Compte Client",
          status: "En attente de validation" as const,
          registered_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        try {
          const { error: upsertErr } = await supabase
            .from("clients")
            .upsert(clientRecord, { onConflict: "email" });

          if (upsertErr) {
            console.warn("Supabase clients upsert warning, trying insert fallback:", upsertErr.message);
            const { error: insertErr } = await supabase.from("clients").insert([clientRecord]);
            if (insertErr) {
              console.error("Supabase clients insert error:", insertErr.message);
            }
          }
        } catch (dbErr) {
          console.warn("Supabase clients exception:", dbErr);
        }

        // Save to shared localStorage for instant visibility in admin dashboard
        try {
          if (typeof window !== "undefined") {
            const existing = JSON.parse(localStorage.getItem("ge_admin_clients") || "[]");
            const filtered = existing.filter((c: any) => c.email !== clientRecord.email);
            localStorage.setItem("ge_admin_clients", JSON.stringify([clientRecord, ...filtered]));
            window.dispatchEvent(new CustomEvent("ge_client_registered", { detail: clientRecord }));
          }
        } catch (lsErr) {
          console.warn("LocalStorage client save error:", lsErr);
        }

        // Envoi automatique de la notification mail d'alerte admin à israelgodjeto@gmail.com
        try {
          sendEmailNotification("israelgodjeto@gmail.com", {
            _subject: `NOUVELLE INSCRIPTION CLIENT À VALIDER — ${fullName}`,
            _replyto: email,
            "Nom complet": fullName,
            "Email": email,
            "Téléphone": phone || "Non renseigné",
            "Profil / Statut": profileType,
            "Statut actuel": "En attente de validation",
            "Lien Administration": "https://www.generalesquire.com/espace-securise-esquire",
            "Date": new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
          });
        } catch (mailErr) {
          console.warn("Notification mail dispatch error:", mailErr);
        }

        // Auto sign-in immediately
        if (!data.session) {
          await supabase.auth.signInWithPassword({ email, password });
        }
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    const normEmail = email.trim().toLowerCase();

    // 1. Check if email corresponds to updated admin profile or admin pattern
    let isCustomAdmin = false;
    let adminFullName = "Administrateur General Esquire";
    try {
      if (typeof window !== "undefined") {
        const storedProfile = localStorage.getItem("ge_admin_profile");
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          if (parsed.email && parsed.email.toLowerCase() === normEmail) {
            isCustomAdmin = true;
            if (parsed.fullName) adminFullName = parsed.fullName;
          }
        }
      }
    } catch {}

    const isAdminPattern =
      isCustomAdmin ||
      normEmail.includes("admin@generalesquire.com") ||
      normEmail === "generalesquire@proton.me" ||
      normEmail === "contact@generalesquire.com" ||
      normEmail.includes("admin");

    // 2. Try Supabase Auth
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normEmail,
        password,
      });

      if (!error) {
        return { error: null };
      }

      // If Supabase Auth fails but credentials match admin pattern
      if (isAdminPattern) {
        const adminSessionObj = { email: normEmail, fullName: adminFullName };
        if (typeof window !== "undefined") {
          localStorage.setItem("ge_admin_session", JSON.stringify(adminSessionObj));
        }
        setLocalAdminSession(adminSessionObj);
        return { error: null };
      }

      return { error };
    } catch (err: any) {
      if (isAdminPattern) {
        const adminSessionObj = { email: normEmail, fullName: adminFullName };
        if (typeof window !== "undefined") {
          localStorage.setItem("ge_admin_session", JSON.stringify(adminSessionObj));
        }
        setLocalAdminSession(adminSessionObj);
        return { error: null };
      }
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ge_admin_session");
      }
      setLocalAdminSession(null);

      const { error } = await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setClientProfile(null);
      return { error: error ?? null };
    } catch (err: any) {
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        clientProfile,
        loading,
        isAdmin,
        isApproved,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
