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
  signUp: (email: string, password: string, fullName: string, profileType?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [clientProfile, setClientProfile] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user has admin privileges (meta role or email rule)
  const isAdmin = Boolean(
    user?.app_metadata?.role === "admin" ||
    user?.user_metadata?.role === "admin" ||
    user?.email?.toLowerCase().includes("admin@generalesquire.com") ||
    user?.email?.toLowerCase() === "admin@generalesquire.com" ||
    user?.email?.toLowerCase() === "generalesquire@proton.me" ||
    user?.email?.toLowerCase() === "contact@generalesquire.com"
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

  const signUp = async (email: string, password: string, fullName: string, profileType = "Particulier") => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            profile_type: profileType,
          },
        },
      });

      if (error) return { error };

      // Ensure client entry exists in clients table
      if (data.user) {
        await supabase.from("clients").upsert(
          {
            email: email.toLowerCase(),
            full_name: fullName,
            profile_type: profileType as any,
            requested_service: "Inscription Compte Client",
            status: "Nouveau",
            registered_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        );

        // Auto sign-in immediately to authenticate user without email verification wait
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
