"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminPage() {
  const { user, isAdmin, signIn, signOut, loading } = useAuth();
  const { lang } = useLanguage();

  // Admin Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<"overview" | "clients" | "payments" | "news">("overview");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(
          lang === "fr"
            ? "Identifiants d'administration incorrects."
            : "Invalid administrator credentials."
        );
      } else {
        setSuccessMessage(
          lang === "fr" ? "Authentification administrateur réussie !" : "Admin logged in successfully!"
        );
      }
    } catch {
      setErrorMessage(lang === "fr" ? "Erreur lors de l'authentification." : "Authentication error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131513] text-[#EDE4CF] flex items-center justify-center font-cinzel text-lg">
        Chargement de l'espace d'administration...
      </div>
    );
  }

  // UNAUTHENTICATED OR NON-ADMIN VIEW -> DISPLAY ADMIN LOGIN FORM ONLY
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#131513] text-[#EDE4CF] flex flex-col justify-center items-center px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(197,160,89,0.15),_transparent_60%)] pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#1a1c1a]/95 backdrop-blur-xl border border-[#C5A059]/60 rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
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

            <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#E9D18F] text-[11px] font-cinzel font-bold uppercase tracking-widest">
              🔒 Espace d'Administration Réservé
            </div>

            <h1 className="font-cinzel text-2xl font-bold text-[#E9D18F]">
              Portail Administration
            </h1>
            <p className="mt-1 text-xs text-[#cabfa6]">
              Veuillez saisir vos accès administrateur pour accéder à la console de gestion.
            </p>
          </div>

          {user && !isAdmin && (
            <div className="mb-6 p-3 bg-amber-950/60 border border-amber-500/50 rounded-xl text-amber-200 text-xs text-center">
              ⚠️ Le compte connecté (<strong>{user.email}</strong>) ne possède pas les droits administrateur.
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

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
                Identifiant Administrateur (Email) *
              </label>
              <input
                type="email"
                required
                placeholder="admin@generalesquire.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
                Mot de Passe Administrateur *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
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
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-bold text-sm uppercase tracking-widest shadow-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Connexion en cours..." : "Se Connecter à l'Administration"}
            </button>
          </form>

          {user && (
            <button
              onClick={() => signOut()}
              className="w-full mt-4 py-2 text-center text-xs font-cinzel text-rose-300 hover:text-rose-200 transition-colors"
            >
              Se déconnecter du compte actuel
            </button>
          )}
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-[#131513] text-[#EDE4CF] py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Admin Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 p-1.5 bg-[#131513] rounded-full border border-[#C5A059]/60 flex items-center justify-center">
              <Image src="/images/logo.png" alt="Logo Admin" fill className="object-contain p-1" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xl font-bold text-[#E9D18F]">Console d'Administration</span>
                <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#E9D18F] text-[10px] font-cinzel font-bold border border-[#C5A059]/40">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-[#cabfa6]">Connecté : {user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-full border border-[#C5A059]/40 text-[#E9D18F] font-cinzel text-xs font-bold hover:bg-[#0F3823] transition-all"
            >
              Voir le Site
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-full bg-rose-950/40 border border-rose-500/40 text-rose-300 font-cinzel text-xs font-bold hover:bg-rose-900/60 transition-all cursor-pointer"
            >
              Déconnexion Admin
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#C5A059]/30 pb-3 font-cinzel text-sm font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 rounded-full transition-all ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-md"
                : "text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#1a1c1a]"
            }`}
          >
            Vue d'Ensemble
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-5 py-2.5 rounded-full transition-all ${
              activeTab === "clients"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-md"
                : "text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#1a1c1a]"
            }`}
          >
            Demandes Clients
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-5 py-2.5 rounded-full transition-all ${
              activeTab === "payments"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-md"
                : "text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#1a1c1a]"
            }`}
          >
            Paiements Reçus
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`px-5 py-2.5 rounded-full transition-all ${
              activeTab === "news"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-md"
                : "text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#1a1c1a]"
            }`}
          >
            Actualités & Articles
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-2xl space-y-2">
              <span className="text-xs text-[#C5A059] font-cinzel font-bold uppercase tracking-wider block">Cabinet</span>
              <div className="text-2xl font-bold text-[#E9D18F]">General Esquire</div>
              <p className="text-xs text-[#cabfa6]">Chrysalides — Conseil Juridique & Cocooning Touristique</p>
            </div>
            <div className="p-6 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-2xl space-y-2">
              <span className="text-xs text-[#C5A059] font-cinzel font-bold uppercase tracking-wider block">Statut Système</span>
              <div className="text-2xl font-bold text-emerald-400">Opérationnel</div>
              <p className="text-xs text-[#cabfa6]">Supabase Realtime & Auth configurés</p>
            </div>
            <div className="p-6 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-2xl space-y-2">
              <span className="text-xs text-[#C5A059] font-cinzel font-bold uppercase tracking-wider block">Accès Administrateur</span>
              <div className="text-2xl font-bold text-[#E9D18F]">Sécurisé</div>
              <p className="text-xs text-[#cabfa6]">Authentification réservée /admin</p>
            </div>
          </div>
        )}

        {activeTab === "clients" && (
          <div className="p-8 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-3xl text-center space-y-4">
            <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">Gestion des Demandes Clients</h3>
            <p className="text-sm text-[#cabfa6]">Les demandes de contacts et consultations apparaissent ici.</p>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="p-8 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-3xl text-center space-y-4">
            <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">Historique des Paiements</h3>
            <p className="text-sm text-[#cabfa6]">Les règlements en ligne et virements enregistrés sont répertoriés ici.</p>
          </div>
        )}

        {activeTab === "news" && (
          <div className="p-8 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-3xl text-center space-y-4">
            <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">Gestion des Actualités</h3>
            <p className="text-sm text-[#cabfa6]">Publiez et modifiez les communiqués et articles du cabinet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
