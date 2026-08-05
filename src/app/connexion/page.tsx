"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

function ClientAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { user, clientProfile, signIn, signUp, signOut, resetPassword } = useAuth();
  const { lang } = useLanguage();

  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [profileType, setProfileType] = useState("Particulier");
  const [countryCode, setCountryCode] = useState("+33");
  const [phoneNum, setPhoneNum] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const COUNTRY_CODES = [
    { code: "+33", flag: "🇫🇷", name: "France (+33)" },
    { code: "+229", flag: "🇧🇯", name: "Bénin (+229)" },
    { code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire (+225)" },
    { code: "+221", flag: "🇸🇳", name: "Sénégal (+221)" },
    { code: "+237", flag: "🇨🇲", name: "Cameroun (+237)" },
    { code: "+228", flag: "🇹🇬", name: "Togo (+228)" },
    { code: "+226", flag: "🇧🇫", name: "Burkina Faso (+226)" },
    { code: "+241", flag: "🇬🇦", name: "Gabon (+241)" },
    { code: "+242", flag: "🇨🇬", name: "Congo (+242)" },
    { code: "+243", flag: "🇨🇩", name: "Congo (RDC) (+243)" },
    { code: "+212", flag: "🇲🇦", name: "Maroc (+212)" },
    { code: "+213", flag: "🇩🇿", name: "Algérie (+213)" },
    { code: "+216", flag: "🇹🇳", name: "Tunisie (+216)" },
    { code: "+1", flag: "🇺🇸/🇨🇦", name: "USA / Canada (+1)" },
    { code: "+44", flag: "🇬🇧", name: "Royaume-Uni (+44)" },
    { code: "+32", flag: "🇧🇪", name: "Belgique (+32)" },
    { code: "+41", flag: "🇨🇭", name: "Suisse (+41)" },
    { code: "+49", flag: "🇩🇪", name: "Allemagne (+49)" },
  ];

  // Status State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setSubmitting(true);

    // ─── Mode : Mot de passe oublié ─────────────────────────────────
    if (mode === "forgot") {
      try {
        const { error } = await resetPassword(email);
        if (error) {
          setErrorMessage(
            lang === "fr"
              ? "Aucun compte trouvé avec cet e-mail ou erreur lors de l'envoi. Vérifiez l'adresse saisie."
              : "No account found with this email or sending error. Please check the address."
          );
        } else {
          setSuccessMessage(
            lang === "fr"
              ? "📧 Un lien de réinitialisation a été envoyé à votre adresse e-mail. Vérifiez votre boîte de réception (et vos spams)."
              : "📧 A password reset link has been sent to your email address. Check your inbox (and spam folder)."
          );
        }
      } catch {
        setErrorMessage(lang === "fr" ? "Une erreur inattendue est survenue." : "An unexpected error occurred.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // ─── Modes Inscription / Connexion ───────────────────────────────
    try {
      if (mode === "register") {
        if (!fullName.trim()) {
          setErrorMessage(lang === "fr" ? "Veuillez entrer votre nom complet." : "Please enter your full name.");
          setSubmitting(false);
          return;
        }

        if (!phoneNum.trim()) {
          setErrorMessage(lang === "fr" ? "Le numéro de téléphone avec indicatif est obligatoire." : "Phone number with country code is required.");
          setSubmitting(false);
          return;
        }

        // Validation stricte du mot de passe selon les consignes employeur
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,}$/;
        if (!passwordRegex.test(password)) {
          setErrorMessage(
            lang === "fr"
              ? "Attention, ce mot de passe ne doit pas être celui de votre messagerie. Il doit comporter au moins huit caractères, dont une lettre majuscule, une lettre minuscule, un chiffre, et un caractère spécial."
              : "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a digit, and a special character."
          );
          setSubmitting(false);
          return;
        }

        const fullPhone = `${countryCode} ${phoneNum.trim()}`;

        const { error } = await signUp(email, password, fullName, profileType, fullPhone);
        if (error) {
          setErrorMessage(error.message || (lang === "fr" ? "Erreur lors de l'inscription." : "Registration failed."));
        } else {
          setSuccessMessage(
            lang === "fr"
              ? "Compte créé avec succès ! Vos informations ont été transmises à l'administration (generalesquire@proton.me). Votre compte doit être confirmé par l'administrateur avant d'accéder au paiement."
              : "Account created successfully! Admin notification sent. Your account must be confirmed by an administrator before accessing payment."
          );
          setTimeout(() => {
            router.push(redirectPath);
          }, 2500);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(lang === "fr" ? "Identifiants incorrects. Veuillez réessayer." : "Invalid credentials. Please try again.");
        } else {
          setSuccessMessage(lang === "fr" ? "Connexion réussie !" : "Logged in successfully!");
          setTimeout(() => {
            router.push(redirectPath);
          }, 1000);
        }
      }
    } catch {
      setErrorMessage(lang === "fr" ? "Une erreur inattendue est survenue." : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setSuccessMessage(lang === "fr" ? "Vous êtes déconnecté." : "Logged out successfully.");
  };

  return (
    <div className="min-h-screen bg-[#131513] text-[#EDE4CF] flex flex-col justify-center items-center px-4 py-16">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(197,160,89,0.15),_transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#1a1c1a]/95 backdrop-blur-xl border border-[#C5A059]/40 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        {/* Header Logo */}
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
            {user
              ? (lang === "fr" ? "Votre Compte Client" : "Your Account")
              : mode === "register"
              ? (lang === "fr" ? "Créer un Compte Client" : "Create Client Account")
              : mode === "forgot"
              ? (lang === "fr" ? "Réinitialiser le Mot de Passe" : "Reset Your Password")
              : (lang === "fr" ? "Espace Connexion Client" : "Client Portal Login")}
          </h1>
          {redirectPath === "/paiement" && !user && (
            <p className="mt-2 text-xs text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl px-3 py-1.5 font-medium">
              {lang === "fr"
                ? "🔒 Veuillez vous connecter ou créer un compte pour effectuer votre règlement."
                : "🔒 Please log in or register to complete your payment."}
            </p>
          )}
        </div>

        {/* ALREADY LOGGED IN VIEW */}
        {user ? (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-[#131513] border border-[#C5A059]/30 rounded-2xl text-left space-y-2">
              <div className="text-xs text-[#cabfa6] font-cinzel uppercase tracking-wider">
                {lang === "fr" ? "Connecté en tant que :" : "Logged in as:"}
              </div>
              <div className="font-semibold text-[#E9D18F] text-base truncate">{user.email}</div>
              {clientProfile && (
                <div className="text-xs text-slate-300">
                  <span className="text-[#C5A059] font-medium">{clientProfile.full_name}</span> ({clientProfile.profile_type})
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {redirectPath !== "/" && (
                <Link
                  href={redirectPath}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-bold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 transition-all text-center"
                >
                  {lang === "fr" ? "Continuer vers votre action" : "Continue to action"}
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-full bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 font-cinzel text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                {lang === "fr" ? "Se Déconnecter" : "Sign Out"}
              </button>
            </div>
          </div>
        ) : (
          /* AUTH FORMS (CLIENT LOGIN / REGISTER ONLY) */
          <>
            {/* Mode Switcher Tabs — masqués en mode forgot */}
            {mode !== "forgot" && (
            <div className="grid grid-cols-2 gap-1 bg-[#131513] p-1 rounded-2xl border border-[#C5A059]/20 mb-6 text-xs font-cinzel font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === "login"
                    ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-md"
                    : "text-[#cabfa6] hover:text-[#E9D18F]"
                }`}
              >
                {lang === "fr" ? "Connexion" : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`py-2 rounded-xl transition-all ${
                  mode === "register"
                    ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-md"
                    : "text-[#cabfa6] hover:text-[#E9D18F]"
                }`}
              >
                {lang === "fr" ? "Inscription" : "Register"}
              </button>
            </div>
            )}

            {/* Bandeau info mode forgot */}
            {mode === "forgot" && (
              <div className="mb-5 p-3 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl text-[#E9D18F] text-xs flex items-start gap-2">
                <span className="mt-0.5">🔑</span>
                <span>
                  {lang === "fr"
                    ? "Saisissez l'adresse e-mail associée à votre compte. Nous vous enverrons un lien sécurisé pour créer un nouveau mot de passe."
                    : "Enter the email address associated with your account. We'll send you a secure link to create a new password."}
                </span>
              </div>
            )}

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <span>✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Full Name for Registration */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
                    {lang === "fr" ? "Prénoms & Nom *" : "First & Last Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                  />
                </div>
              )}

              {/* Profile Type for Registration */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
                    {lang === "fr" ? "Profil *" : "Profile Type *"}
                  </label>
                  <select
                    value={profileType}
                    onChange={(e) => setProfileType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                  >
                    <option value="Particulier">Particulier</option>
                    <option value="Chef d'Entreprise">Chef d'Entreprise / Entrepreneur</option>
                    <option value="Institution">Institution Publique</option>
                    <option value="Professionnel du Droit">Professionnel du Droit</option>
                  </select>
                </div>
              )}

              {/* Phone Number with Country Code for Registration (Obligatoire) */}
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
                    {lang === "fr" ? "Numéro de Téléphone avec Indicatif *" : "Phone Number with Country Code *"}
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-1/3 px-2 py-2.5 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-xs sm:text-sm focus:outline-none focus:border-[#E9D18F] cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="6 12 34 56 78"
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value)}
                      className="w-2/3 px-4 py-2.5 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
                  {lang === "fr" ? "Adresse E-mail *" : "Email Address *"}
                </label>
                <input
                  type="email"
                  required
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                />
              </div>

              {/* Password Input — masqué en mode forgot */}
              {mode !== "forgot" && (
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
                  {lang === "fr" ? "Mot de Passe *" : "Password *"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
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
                {/* Lien Mot de passe oublié */}
                {mode === "login" && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      className="text-[10px] font-cinzel text-[#C5A059]/80 hover:text-[#E9D18F] transition-colors underline underline-offset-2 cursor-pointer"
                    >
                      {lang === "fr" ? "Mot de passe oublié ?" : "Forgot password?"}
                    </button>
                  </div>
                )}
              </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-bold text-sm uppercase tracking-widest shadow-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting
                  ? (lang === "fr" ? "Traitement..." : "Processing...")
                  : mode === "forgot"
                  ? (lang === "fr" ? "Envoyer le Lien" : "Send Reset Link")
                  : mode === "register"
                  ? (lang === "fr" ? "Créer Mon Compte" : "Create Account")
                  : (lang === "fr" ? "Se Connecter" : "Sign In")}
              </button>

              {/* Retour à la connexion en mode forgot */}
              {mode === "forgot" && (
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-xs font-cinzel text-[#cabfa6] hover:text-[#E9D18F] transition-colors cursor-pointer"
                  >
                    ← {lang === "fr" ? "Retour à la connexion" : "Back to login"}
                  </button>
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#131513] text-[#EDE4CF] flex items-center justify-center font-cinzel text-lg">
        Chargement...
      </div>
    }>
      <ClientAuthForm />
    </Suspense>
  );
}
