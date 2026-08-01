"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, Client } from "@/lib/supabase";

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
  const [loading, setLoading] = useState(true);

  // Check if user has admin privileges
  const isAdmin = Boolean(
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

      if (error) return { error };

      // Ensure client entry exists in clients table with status 'En attente de validation'
      if (data.user) {
        await supabase.from("clients").upsert(
          {
            email: email.toLowerCase(),
            full_name: fullName,
            phone: phone || null,
            profile_type: profileType as any,
            requested_service: "Inscription Compte Client",
            status: "En attente de validation",
            registered_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        );

        // Envoi automatique de la notification mail d'alerte admin à generalesquire@proton.me
        try {
          await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: fullName,
              email: email,
              phone: phone || "Non renseigné",
              structure: profileType,
              subject: `NOUVELLE INSCRIPTION CLIENT À VALIDER — ${fullName}`,
              message:
                `Un nouvel utilisateur vient de s’inscrire sur votre plateforme.\n\n` +
                `INFORMATIONS DU CLIENT :\n` +
                `- Nom complet : ${fullName}\n` +
                `- Email : ${email}\n` +
                `- Téléphone : ${phone || 'Non renseigné'}\n` +
                `- Profil / Statut : ${profileType}\n` +
                `- Date & Heure : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}\n` +
                `- Statut actuel : En attente de validation\n\n` +
                `ACTION REQUISE :\n` +
                `Veuillez examiner la demande et décider d'Accepter, Refuser ou Mettre en attente le compte afin de débloquer ou maintenir l'accès au paiement.\n\n` +
                `👉 Lien direct d'administration : https://www.generalesquire.com/espace-securise-esquire`,
              type: "Nouvelle Inscription Client",
            }),
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
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error ?? null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
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
