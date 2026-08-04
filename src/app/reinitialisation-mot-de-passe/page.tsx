"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  // Supabase envoie les tokens via le fragment d'URL (#access_token=...&type=recovery)
  // On les parse manuellement et on établit la session explicitement
  useEffect(() => {
    const handleRecoverySession = async () => {
      // 1. Vérifier s'il y a un hash dans l'URL avec les tokens
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash && hash.includes("type=recovery")) {
        try {
          const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            // Établir la session Supabase explicitement avec les tokens
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error && data.session) {
              setSessionReady(true);
              // Nettoyer le hash de l'URL sans recharger la page
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", window.location.pathname);
              }
              return;
            }
          }
        } catch (err) {
          console.warn("Erreur lors du parsing du token de récupération:", err);
        }
      }

      // 2. Écouter l'événement PASSWORD_RECOVERY via onAuthStateChange
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setSessionReady(true);
          subscription.unsubscribe();
        } else if (event === "SIGNED_IN" && session) {
          setSessionReady(true);
          subscription.unsubscribe();
        }
      });

      // 3. Vérification directe de la session existante
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
        subscription.unsubscribe();
        return;
      }

      // 4. Timeout de sécurité : si aucune session après 6s
      const timeout = setTimeout(() => {
        setSessionError(true);
        subscription.unsubscribe();
      }, 6000);

      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    };

    handleRecoverySession();
  }, []);


  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage(
        lang === "fr"
          ? "Les mots de passe ne correspondent pas."
          : "Passwords do not match."
      );
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        lang === "fr"
          ? "Le mot de passe doit comporter au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial."
          : "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a digit, and a special character."
      );
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMessage(
          lang === "fr"
            ? `Erreur : ${error.message}. Veuillez redemander un lien de réinitialisation.`
            : `Error: ${error.message}. Please request a new reset link.`
        );
      } else {
        setSuccessMessage(
          lang === "fr"
            ? "✅ Mot de passe mis à jour avec succès ! Vous allez être redirigé vers la page de connexion..."
            : "✅ Password updated successfully! Redirecting to login page..."
        );
        setTimeout(() => router.push("/connexion"), 2500);
      }
    } catch {
      setErrorMessage(
        lang === "fr"
          ? "Une erreur inattendue est survenue."
          : "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131513] text-[#EDE4CF] flex flex-col justify-center items-center px-4 py-16">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(197,160,89,0.15),_transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#1a1c1a]/95 backdrop-blur-xl border border-[#C5A059]/40 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex flex-col items-center group mb-4">
            <div className="relative w-16 h-16 p-2 bg-[#131513] rounded-full border border-[#C5A059]/70 shadow-[0_0_20px_rgba(197,160,89,0.4)] mb-2 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/logo.png"
                alt="General Esquire Logo"
                fill
                sizes="64px"
                className="object-contain p-1 filter brightness-110 drop-shadow-[0_0_8px_rgba(197,160,89,0.8)]"
              />
            </div>
            <span className="font-cinzel text-xl font-bold tracking-widest text-[#C5A059] group-hover:text-[#E9D18F] transition-colors">
              GENERAL ESQUIRE
            </span>
            <span className="font-cinzel text-[10px] tracking-[0.3em] text-[#cabfa6] uppercase">
              Chrysalides
            </span>
          </Link>

          <h1 className="font-cinzel text-2xl font-bold text-[#E9D18F]">
            {lang === "fr" ? "Nouveau Mot de Passe" : "Create New Password"}
          </h1>
          <p className="font-cormorant text-sm text-[#cabfa6] mt-1">
            {lang === "fr"
              ? "Saisissez votre nouveau mot de passe sécurisé."
              : "Enter your new secure password below."}
          </p>
        </div>

        {/* Session error — lien expiré */}
        {sessionError && !sessionReady && (
          <div className="text-center space-y-4">
            <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-rose-200 text-sm">
              <span className="text-2xl block mb-2">⏰</span>
              <p className="font-cinzel text-xs font-bold mb-1">
                {lang === "fr" ? "Lien expiré ou invalide" : "Link expired or invalid"}
              </p>
              <p className="text-[11px] text-rose-300/80">
                {lang === "fr"
                  ? "Ce lien de réinitialisation est expiré (valable 1h). Veuillez en demander un nouveau."
                  : "This reset link has expired (valid 1h). Please request a new one."}
              </p>
            </div>
            <Link
              href="/connexion"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
            >
              {lang === "fr" ? "Demander un nouveau lien" : "Request a new link"}
            </Link>
          </div>
        )}

        {/* Loading spinner pendant la vérification de session */}
        {!sessionReady && !sessionError && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C5A059]" />
            <p className="font-cinzel text-xs text-[#cabfa6] uppercase tracking-widest">
              {lang === "fr" ? "Vérification du lien..." : "Verifying link..."}
            </p>
          </div>
        )}

        {/* Formulaire principal */}
        {sessionReady && (
          <>
            {/* Error */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <span>✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            {!successMessage && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nouveau mot de passe */}
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
                    {lang === "fr" ? "Nouveau Mot de Passe *" : "New Password *"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-xs text-[#cabfa6] hover:text-[#E9D18F]"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#cabfa6]/70 mt-1">
                    {lang === "fr"
                      ? "8 caractères min. : majuscule, minuscule, chiffre, caractère spécial."
                      : "Min. 8 chars: uppercase, lowercase, digit, special character."}
                  </p>
                </div>

                {/* Confirmation */}
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
                    {lang === "fr" ? "Confirmer le Mot de Passe *" : "Confirm Password *"}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-2.5 bg-[#131513] border rounded-xl text-[#EDE4CF] text-sm focus:outline-none transition-colors ${
                        confirmPassword && confirmPassword !== password
                          ? "border-rose-500/60 focus:border-rose-400"
                          : confirmPassword && confirmPassword === password
                          ? "border-emerald-500/60 focus:border-emerald-400"
                          : "border-[#C5A059]/40 focus:border-[#E9D18F]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-2.5 text-xs text-[#cabfa6] hover:text-[#E9D18F]"
                    >
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                    {/* Indicateur visuel de correspondance */}
                    {confirmPassword && (
                      <span className="absolute right-10 top-2.5 text-sm">
                        {confirmPassword === password ? "✅" : "❌"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-bold text-sm uppercase tracking-widest shadow-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? (lang === "fr" ? "Mise à jour..." : "Updating...")
                    : (lang === "fr" ? "Enregistrer le Nouveau Mot de Passe" : "Save New Password")}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/connexion"
                className="text-xs font-cinzel text-[#cabfa6] hover:text-[#E9D18F] transition-colors"
              >
                ← {lang === "fr" ? "Retour à la connexion" : "Back to login"}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ReinitialisationMotDePassePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#131513] text-[#EDE4CF] flex items-center justify-center font-cinzel text-lg">
          Chargement...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
