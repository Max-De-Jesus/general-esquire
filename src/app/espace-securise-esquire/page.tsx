"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { NewsItem } from "@/data/adminStore";

// Helper client-side image compressor (max 1200px width/height, quality 0.82 ~100-150KB)
const compressImageFile = (file: File, maxDimension = 1200, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export default function EspaceSecurisePage() {
  const { user, isAdmin, signIn, signOut, loading } = useAuth();
  const { lang } = useLanguage();

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Dashboard State
  const [activeTab, setActiveTab] = useState<"overview" | "clients" | "payments" | "news">("news");

  // News Manager State
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [savingNews, setSavingNews] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState("");
  const [newsError, setNewsError] = useState("");

  // New Article Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formCategory, setFormCategory] = useState<NewsItem["category"]>("Annonces");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formAuthor, setFormAuthor] = useState("Administration General Esquire");
  const [formSummary, setFormSummary] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);

  // Handle Multiple Image File Upload (compressed DataURL / base64)
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setNewsError("");
    const compressedBatch: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 15 * 1024 * 1024) {
        setNewsError(lang === "fr" ? "Certaines images dépassent 15 Mo." : "Some images exceed 15MB.");
        continue;
      }
      try {
        const compressed = await compressImageFile(file);
        compressedBatch.push(compressed);
      } catch (err) {
        console.error("Error compressing image file:", err);
      }
    }

    if (compressedBatch.length > 0) {
      setFormImages((prev) => [...prev, ...compressedBatch]);
    }
    e.target.value = "";
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setFormImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput("");
  };

  const handleRemoveFormImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Fetch News from Supabase & LocalStorage
  const fetchNewsList = async () => {
    setLoadingNews(true);
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem("ge_deleted_news_ids") || "[]");
    } catch {}

    const localStored = typeof window !== "undefined" ? localStorage.getItem("ge_admin_news") : null;
    let localItems: NewsItem[] = [];
    if (localStored) {
      try {
        localItems = JSON.parse(localStored).filter((n: NewsItem) => !deletedIds.includes(n.id));
      } catch {}
    }

    try {
      const { data, error } = await supabase
        .from("actualites")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped: NewsItem[] = data
          .filter((a: any) => !deletedIds.includes(a.id))
          .map((a: any) => ({
            id: a.id,
            title: a.title,
            subtitle: a.subtitle ?? undefined,
            summary: a.summary,
            content: a.content,
            category: a.category as NewsItem["category"],
            date: a.date,
            imageUrl: (a.images && a.images[0]) || a.image_url || "/images/chant.avif",
            images: a.images || (a.image_url ? [a.image_url] : ["/images/chant.avif"]),
            author: a.author,
            isFeatured: a.is_featured,
            isPublished: a.is_published,
          }));

        // Merge mapped with local items avoiding duplicate IDs
        const existingIds = new Set(mapped.map((m) => m.id));
        const extraLocal = localItems.filter((item) => !existingIds.has(item.id));
        const merged = [...extraLocal, ...mapped];

        setNewsList(merged);
        localStorage.setItem("ge_admin_news", JSON.stringify(merged));
      } else {
        setNewsList(localItems);
      }
    } catch {
      setNewsList(localItems);
    } finally {
      setLoadingNews(false);
    }
  };

  // Demandes Clients State
  const [demandesList, setDemandesList] = useState<any[]>([]);
  const [loadingDemandes, setLoadingDemandes] = useState(false);
  const [demandesFilter, setDemandesFilter] = useState("");

  // Fetch Demandes Clients from Supabase & LocalStorage
  const fetchDemandesList = async () => {
    setLoadingDemandes(true);
    try {
      const { data, error } = await supabase
        .from("demandes_clients")
        .select("*")
        .order("registered_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setDemandesList(data);
        localStorage.setItem("ge_demandes_clients", JSON.stringify(data));
      } else {
        const local = localStorage.getItem("ge_demandes_clients");
        if (local) setDemandesList(JSON.parse(local));
        else setDemandesList([]);
      }
    } catch {
      const local = localStorage.getItem("ge_demandes_clients");
      if (local) setDemandesList(JSON.parse(local));
      else setDemandesList([]);
    } finally {
      setLoadingDemandes(false);
    }
  };

  const handleDeleteDemande = async (id: string) => {
    if (!confirm(lang === "fr" ? "Voulez-vous vraiment supprimer cette demande client ?" : "Delete this client request?")) return;
    try {
      await supabase.from("demandes_clients").delete().eq("id", id);
    } catch (err) {
      console.error(err);
    }
    const updated = demandesList.filter((d) => d.id !== id);
    setDemandesList(updated);
    localStorage.setItem("ge_demandes_clients", JSON.stringify(updated));
  };

  const handleToggleDemandeStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Traité" ? "Nouveau" : "Traité";
    try {
      await supabase.from("demandes_clients").update({ status: newStatus }).eq("id", id);
    } catch (err) {
      console.error(err);
    }
    const updated = demandesList.map((d) => (d.id === id ? { ...d, status: newStatus } : d));
    setDemandesList(updated);
    localStorage.setItem("ge_demandes_clients", JSON.stringify(updated));
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchNewsList();
      fetchDemandesList();
    }
  }, [user, isAdmin]);

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
          lang === "fr" ? "Authentification réussie !" : "Logged in successfully!"
        );
      }
    } catch {
      setErrorMessage(lang === "fr" ? "Erreur lors de l'authentification." : "Authentication error.");
    } finally {
      setSubmitting(false);
    }
  };

  // Create / Publish New Article (syncs with Supabase DB & LocalStorage)
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsSuccess("");
    setNewsError("");

    if (!formTitle || !formSummary || !formContent) {
      setNewsError(lang === "fr" ? "Veuillez remplir le titre, le résumé et le contenu." : "Please fill title, summary and content.");
      return;
    }

    setSavingNews(true);
    const newId = typeof crypto !== "undefined" && crypto.randomUUID 
      ? crypto.randomUUID() 
      : "10000000-0000-4000-8000-" + Date.now().toString().padStart(12, "0");

    const finalImagesList = formImages.length > 0 ? formImages : ["/images/chant.avif"];
    const mainImage = finalImagesList[0];

    const newItem: NewsItem = {
      id: newId,
      title: formTitle,
      subtitle: formSubtitle || undefined,
      summary: formSummary,
      content: formContent,
      category: formCategory,
      date: formDate,
      imageUrl: mainImage,
      images: finalImagesList,
      author: formAuthor || "Administration General Esquire",
      isFeatured: formIsFeatured,
      isPublished: formIsPublished,
    };

    // Attempt Supabase insert
    try {
      await supabase.from("actualites").insert([{
        id: newId,
        title: formTitle,
        subtitle: formSubtitle || null,
        summary: formSummary,
        content: formContent,
        category: formCategory,
        date: formDate,
        author: formAuthor || "Administration General Esquire",
        image_url: mainImage,
        images: finalImagesList,
        is_featured: formIsFeatured,
        is_published: formIsPublished,
      }]);
    } catch (err) {
      console.error("Supabase insert error:", err);
    }

    // Save to local storage for instant availability across tabs
    const updated = [newItem, ...newsList];
    setNewsList(updated);
    try {
      localStorage.setItem("ge_admin_news", JSON.stringify(updated));
      localStorage.setItem("ge_public_news", JSON.stringify(updated));
      localStorage.setItem("ge_admin_news_initialized", "true");
    } catch {}

    setNewsSuccess(lang === "fr" ? "Actualité publiée avec succès !" : "News article published successfully!");

    // Reset Form
    setFormTitle("");
    setFormSubtitle("");
    setFormSummary("");
    setFormContent("");
    setFormImages([]);
    setUrlInput("");
    setFormIsFeatured(false);
    setSavingNews(false);
  };

  // Delete an article
  const handleDeleteNews = async (id: string) => {
    if (!confirm(lang === "fr" ? "Voulez-vous vraiment supprimer cette actualité ?" : "Are you sure you want to delete this news article?")) return;

    // Track deleted IDs in localStorage
    try {
      const deletedIds: string[] = JSON.parse(localStorage.getItem("ge_deleted_news_ids") || "[]");
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem("ge_deleted_news_ids", JSON.stringify(deletedIds));
      }
    } catch {}

    // Attempt Supabase delete
    try {
      await supabase.from("actualites").delete().eq("id", id);
    } catch (e) {
      console.error("Supabase delete error:", e);
    }

    // Update local state
    const updated = newsList.filter((item) => item.id !== id);
    setNewsList(updated);
    try {
      localStorage.setItem("ge_admin_news", JSON.stringify(updated));
      localStorage.setItem("ge_public_news", JSON.stringify(updated));
    } catch {}
    setNewsSuccess(lang === "fr" ? "Actualité supprimée !" : "News article deleted!");
  };

  // Clear ALL articles
  const handleClearAllNews = async () => {
    if (!confirm(lang === "fr" ? "ATTENTION : Supprimer TOUTES les actualités ?" : "WARNING: Delete ALL news articles?")) return;

    try {
      const idsToDelete = newsList.map((n) => n.id);
      const deletedIds: string[] = JSON.parse(localStorage.getItem("ge_deleted_news_ids") || "[]");
      const combined = Array.from(new Set([...deletedIds, ...idsToDelete]));
      localStorage.setItem("ge_deleted_news_ids", JSON.stringify(combined));
    } catch {}

    // Attempt Supabase delete
    try {
      await supabase.from("actualites").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    } catch (e) {
      console.error("Supabase delete all error:", e);
    }

    setNewsList([]);
    try {
      localStorage.setItem("ge_admin_news", JSON.stringify([]));
      localStorage.setItem("ge_public_news", JSON.stringify([]));
      localStorage.setItem("ge_admin_news_initialized", "true");
    } catch {}
    setNewsSuccess(lang === "fr" ? "Toutes les actualités ont été supprimées !" : "All news articles deleted!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131513] text-[#EDE4CF] flex items-center justify-center font-cinzel text-lg">
        Chargement du portail de gestion...
      </div>
    );
  }

  // UNAUTHENTICATED OR NON-ADMIN VIEW -> DISPLAY LOGIN FORM ONLY
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
              🔒 Espace Réservé & Sécurisé
            </div>

            <h1 className="font-cinzel text-2xl font-bold text-[#E9D18F]">
              Console de Gestion Privée
            </h1>
            <p className="mt-1 text-xs text-[#cabfa6]">
              Veuillez saisir vos identifiants habilités pour accéder à l&apos;espace de gestion.
            </p>
          </div>

          {user && !isAdmin && (
            <div className="mb-6 p-3 bg-amber-950/60 border border-amber-500/50 rounded-xl text-amber-200 text-xs text-center">
              ⚠️ Le compte connecté (<strong>{user.email}</strong>) ne possède pas les habilitations d&apos;accès.
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
                Identifiant Habilité (Email) *
              </label>
              <input
                type="email"
                required
                placeholder="generalesquire@proton.me"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-1">
                Mot de Passe *
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
              {submitting ? "Connexion en cours..." : "Accéder à l'Espace Sécurisé"}
            </button>
          </form>

          {user && (
            <button
              onClick={() => signOut()}
              className="w-full mt-4 py-2 text-center text-xs font-cinzel text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
            >
              Se déconnecter du compte actuel
            </button>
          )}
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-[#131513] text-[#EDE4CF] py-10 px-4 md:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 p-1.5 bg-[#131513] rounded-full border border-[#C5A059]/60 flex items-center justify-center">
              <Image src="/images/logo.png" alt="Logo General Esquire" fill className="object-contain p-1" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xl font-bold text-[#E9D18F]">Console de Gestion Privée</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#E9D18F] text-[10px] font-cinzel font-bold border border-[#C5A059]/40">
                  HABILITÉ
                </span>
              </div>
              <p className="text-xs text-[#cabfa6]">Connecté en tant que : {user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/actualites"
              target="_blank"
              className="px-4 py-2 rounded-full border border-[#C5A059]/40 text-[#E9D18F] font-cinzel text-xs font-bold hover:bg-[#0F3823] transition-all flex items-center gap-1.5"
            >
              <span>Voir les Actualités</span>
              <span>↗</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-full bg-rose-950/40 border border-rose-500/40 text-rose-300 font-cinzel text-xs font-bold hover:bg-rose-900/60 transition-all cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 border-b border-[#C5A059]/30 pb-4 font-cinzel text-sm font-bold">
          <button
            onClick={() => setActiveTab("news")}
            className={`px-6 py-3 rounded-full transition-all cursor-pointer ${
              activeTab === "news"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-lg scale-105"
                : "text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#1a1c1a]"
            }`}
          >
            📢 Gestion des Actualités (Uploader)
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-full transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-lg scale-105"
                : "text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#1a1c1a]"
            }`}
          >
            Vue d'Ensemble
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-6 py-3 rounded-full transition-all cursor-pointer ${
              activeTab === "clients"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-lg scale-105"
                : "text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#1a1c1a]"
            }`}
          >
            Demandes Clients
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-6 py-3 rounded-full transition-all cursor-pointer ${
              activeTab === "payments"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-lg scale-105"
                : "text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#1a1c1a]"
            }`}
          >
            Paiements Reçus
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "news" && (
          <div className="space-y-10">
            {/* Formulaire de Publication d'Actualités */}
            <div className="p-8 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-3xl shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#C5A059]/30 pb-4">
                <div>
                  <h3 className="font-cinzel text-2xl font-bold text-[#E9D18F] flex items-center gap-2">
                    <span>📝</span>
                    <span>Publier une Nouvelle Actualité (Multi-Photos)</span>
                  </h3>
                  <p className="text-sm font-cormorant text-[#cabfa6]">
                    Uploadez une ou plusieurs photos et ajoutez vos informations pour publier immédiatement un article.
                  </p>
                </div>
                {newsList.length > 0 && (
                  <button
                    onClick={handleClearAllNews}
                    className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-cinzel text-xs font-bold hover:bg-rose-900 transition-colors cursor-pointer"
                  >
                    🗑️ Supprimer TOUTES les actualités ({newsList.length})
                  </button>
                )}
              </div>

              {newsSuccess && (
                <div className="p-4 bg-emerald-950/70 border border-emerald-500/60 rounded-2xl text-emerald-200 text-sm font-cinzel flex items-center gap-3">
                  <span className="text-xl">✅</span>
                  <span>{newsSuccess}</span>
                </div>
              )}

              {newsError && (
                <div className="p-4 bg-rose-950/70 border border-rose-500/60 rounded-2xl text-rose-200 text-sm font-cinzel flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <span>{newsError}</span>
                </div>
              )}

              <form onSubmit={handleCreateNews} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Titre */}
                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                      Titre de l'Actualité *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Conférence sur les risques juridiques..."
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                    />
                  </div>

                  {/* Sous-titre */}
                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                      Sous-titre (Optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Protéger sa réputation et son patrimoine..."
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as NewsItem["category"])}
                      className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                    >
                      <option value="Conseil Juridique">Conseil Juridique</option>
                      <option value="Chrysalides">Chrysalides</option>
                      <option value="Événements">Événements</option>
                      <option value="Annonces">Annonces</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                      Date de Publication *
                    </label>
                    <div className="relative cursor-pointer">
                      <input
                        type="date"
                        required
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        onClick={(e) => e.currentTarget.showPicker?.()}
                        className="w-full px-4 py-3 pr-12 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F] [color-scheme:dark] cursor-pointer"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#C5A059]">
                          <rect x="3" y="4" width="18" height="18" rx="3" stroke="#C5A059" strokeWidth="1.8"/>
                          <path d="M3 9h18" stroke="#C5A059" strokeWidth="1.8"/>
                          <path d="M8 2v4M16 2v4" stroke="#C5A059" strokeWidth="1.8" strokeLinecap="round"/>
                          <circle cx="8" cy="13" r="1.1" fill="#C5A059"/>
                          <circle cx="12" cy="13" r="1.1" fill="#C5A059"/>
                          <circle cx="16" cy="13" r="1.1" fill="#C5A059"/>
                          <circle cx="8" cy="17" r="1.1" fill="#C5A059"/>
                          <circle cx="12" cy="17" r="1.1" fill="#C5A059"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Auteur */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                      Auteur / Signataire
                    </label>
                    <input
                      type="text"
                      placeholder="Administration General Esquire"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                    />
                  </div>
                </div>

                {/* MULTI-PHOTO UPLOAD & PREVIEW SECTION */}
                <div className="p-6 bg-[#131513] border border-[#C5A059]/30 rounded-2xl space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-cinzel font-semibold text-[#E9D18F] uppercase tracking-wider">
                      🖼️ Galerie Photo ({formImages.length} photo{formImages.length > 1 ? "s" : ""})
                    </label>
                    <span className="text-xs text-[#C5A059] font-cormorant">
                      Vous pouvez sélectionner plusieurs photos à la fois
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                      {/* File Upload Input */}
                      <div>
                        <span className="text-xs text-[#cabfa6] block mb-1.5 font-cormorant font-bold">
                          1. Sélectionner une ou plusieurs photos depuis votre appareil :
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleMultipleImageUpload}
                          className="w-full px-3 py-2.5 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-xl text-xs text-[#EDE4CF] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-cinzel file:font-bold file:bg-[#C5A059] file:text-black hover:file:bg-[#E9D18F] cursor-pointer"
                        />
                      </div>

                      <div className="text-center text-xs text-[#cabfa6]/60 font-cinzel uppercase py-1">
                        — OU —
                      </div>

                      {/* URL Add Input */}
                      <div>
                        <span className="text-xs text-[#cabfa6] block mb-1.5 font-cormorant font-bold">
                          2. Ajouter l'URL d'une image web :
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="/images/chant.avif ou https://..."
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className="flex-1 px-4 py-2 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-xs focus:outline-none focus:border-[#E9D18F]"
                          />
                          <button
                            type="button"
                            onClick={handleAddUrlImage}
                            className="px-4 py-2 bg-[#C5A059] hover:bg-[#E9D18F] text-black font-cinzel font-bold text-xs rounded-xl transition-colors"
                          >
                            + Ajouter
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preview Gallery Grid */}
                    <div className="p-4 bg-[#1a1c1a] border border-[#C5A059]/20 rounded-xl min-h-[160px]">
                      {formImages.length > 0 ? (
                        <div className="space-y-3">
                          <span className="text-[11px] font-cinzel text-[#C5A059] uppercase tracking-wider block">
                            Aperçu des photos importées :
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
                            {formImages.map((imgUrl, idx) => (
                              <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#C5A059]/40 h-24 bg-black">
                                <Image
                                  src={imgUrl}
                                  alt={`Photo ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                {idx === 0 && (
                                  <span className="absolute top-1 left-1 bg-[#C5A059] text-black font-cinzel text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow">
                                    ⭐ Couverture
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFormImage(idx)}
                                  className="absolute top-1 right-1 bg-rose-950/90 text-rose-200 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:bg-rose-600 transition-colors shadow"
                                  title="Supprimer cette photo"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-xs text-[#cabfa6]/70 py-8 font-cormorant">
                          <span className="text-3xl block mb-2">🖼️</span>
                          Aucune photo sélectionnée pour cet article. L'image par défaut (/images/chant.avif) sera utilisée.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Résumé */}
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                    Résumé de l'Article (Chapeau) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Bref résumé accrocheur affiché sur les cartes d'actualités..."
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                  />
                </div>

                {/* Contenu Détaillé */}
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                    Contenu Détaillé de l'Article *
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Rédigez ici le texte intégral de votre article..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-cinzel text-[#EDE4CF]">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#C5A059]"
                    />
                    <span>⭐ Mettre cet article à la Une</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-cinzel text-[#EDE4CF]">
                    <input
                      type="checkbox"
                      checked={formIsPublished}
                      onChange={(e) => setFormIsPublished(e.target.checked)}
                      className="w-4 h-4 accent-[#C5A059]"
                    />
                    <span>✅ Publier immédiatement</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={savingNews}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] text-black font-cinzel font-bold text-sm uppercase tracking-widest shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingNews ? "Publication en cours..." : "🚀 Publier l'Actualité"}
                </button>
              </form>
            </div>

            {/* Liste des Actualités Existantes */}
            <div className="p-8 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-3xl shadow-xl space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-[#E9D18F] flex items-center justify-between">
                <span>📚 Liste des Actualités Publiées ({newsList.length})</span>
                <button
                  onClick={fetchNewsList}
                  className="text-xs font-cinzel text-[#C5A059] hover:text-[#E9D18F] transition-colors"
                >
                  🔄 Raîfraîchir la liste
                </button>
              </h3>

              {loadingNews ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059] mx-auto"></div>
                </div>
              ) : newsList.length > 0 ? (
                <div className="space-y-4">
                  {newsList.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 bg-[#131513] border border-[#C5A059]/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#E9D18F] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#1a1c1a] border border-[#C5A059]/30">
                          <Image
                            src={item.imageUrl || (item.images && item.images[0]) || "/images/chant.avif"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 bg-[#C5A059]/20 text-[#E9D18F] text-[10px] font-cinzel font-bold rounded-full border border-[#C5A059]/40 uppercase">
                              {item.category}
                            </span>
                            <span className="text-xs text-[#cabfa6]">{item.date}</span>
                            {item.isFeatured && (
                              <span className="text-amber-400 text-xs">⭐ À la une</span>
                            )}
                            {item.images && item.images.length > 1 && (
                              <span className="text-[10px] bg-[#C5A059]/15 text-[#E9D18F] px-2 py-0.5 rounded-md font-mono">
                                🖼️ {item.images.length} photos
                              </span>
                            )}
                          </div>
                          <h4 className="font-cinzel text-base font-bold text-[#EDE4CF] leading-snug">
                            {item.title}
                          </h4>
                          <p className="font-cormorant text-xs text-[#cabfa6] line-clamp-1">
                            {item.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="px-4 py-2 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 font-cinzel text-xs font-bold hover:bg-rose-900 transition-colors cursor-pointer shadow-md"
                        >
                          🗑️ Supprimer l'Article
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#cabfa6] font-cormorant text-lg">
                  Aucune actualité présente. Utilisez le formulaire ci-dessus pour publier votre premier article !
                </div>
              )}
            </div>
          </div>
        )}

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
              <span className="text-xs text-[#C5A059] font-cinzel font-bold uppercase tracking-wider block">Accès Habilité</span>
              <div className="text-2xl font-bold text-[#E9D18F]">Sécurisé</div>
              <p className="text-xs text-[#cabfa6]">Authentification réservée aux administrateurs</p>
            </div>
          </div>
        )}

        {activeTab === "clients" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1a1c1a] p-6 rounded-2xl border border-[#C5A059]/30 shadow-md">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">
                  {lang === "fr" ? "Gestion des Demandes Clients" : "Client Requests Management"}
                </h3>
                <p className="text-xs text-[#cabfa6] mt-1">
                  {lang === "fr"
                    ? `${demandesList.length} demande(s) reçue(s) via les formulaires de contact et consultation.`
                    : `${demandesList.length} request(s) received via contact and consultation forms.`}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder={lang === "fr" ? "Rechercher un client ou sujet…" : "Search client or subject…"}
                  value={demandesFilter}
                  onChange={(e) => setDemandesFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-[#0d0e0d] border border-[#C5A059]/40 text-xs text-[#EDE4CF] focus:outline-none focus:border-[#E9D18F] w-full sm:w-64"
                />
                <button
                  onClick={fetchDemandesList}
                  className="px-4 py-2 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#E9D18F] text-xs font-cinzel font-bold border border-[#C5A059]/40 transition-colors whitespace-nowrap"
                >
                  ↻ {lang === "fr" ? "Actualiser" : "Refresh"}
                </button>
              </div>
            </div>

            {loadingDemandes ? (
              <div className="p-12 text-center text-[#C5A059] font-cinzel text-sm animate-pulse">
                {lang === "fr" ? "Chargement des demandes clients…" : "Loading client requests…"}
              </div>
            ) : demandesList.length === 0 ? (
              <div className="p-12 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-3xl text-center space-y-3">
                <div className="text-4xl text-[#C5A059]">📩</div>
                <h4 className="font-cinzel text-lg font-bold text-[#E9D18F]">
                  {lang === "fr" ? "Aucune Demande Pour le Moment" : "No Client Requests Yet"}
                </h4>
                <p className="text-xs text-[#cabfa6] max-w-md mx-auto">
                  {lang === "fr"
                    ? "Les formulaires de contact de la page Conseil Juridique et Cocooning Touristique enregistreront directement les demandes des clients ici."
                    : "Contact forms from Legal Advisory and Tourist Cocooning pages will log client requests directly here."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {demandesList
                  .filter((d) => {
                    if (!demandesFilter.trim()) return true;
                    const query = demandesFilter.toLowerCase();
                    return (
                      d.full_name?.toLowerCase().includes(query) ||
                      d.email?.toLowerCase().includes(query) ||
                      d.subject?.toLowerCase().includes(query) ||
                      d.phone?.toLowerCase().includes(query) ||
                      d.country?.toLowerCase().includes(query)
                    );
                  })
                  .map((d) => (
                    <div
                      key={d.id}
                      className="p-6 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-2xl space-y-4 shadow-lg hover:border-[#C5A059]/60 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#C5A059]/20 pb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-cinzel font-bold text-base text-[#E9D18F]">
                            {d.full_name || "Client"}
                          </span>
                          {d.structure && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#0e2a1b] text-emerald-300 border border-emerald-500/30 text-[10px] font-cinzel uppercase">
                              {d.structure}
                            </span>
                          )}
                          {d.country && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#2a240e] text-amber-300 border border-amber-500/30 text-[10px] font-cinzel">
                              🌍 {d.country}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-wider ${
                              d.status === "Traité"
                                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                                : "bg-amber-950/80 text-amber-400 border border-amber-500/40"
                            }`}
                          >
                            {d.status || "Nouveau"}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {d.registered_at ? new Date(d.registered_at).toLocaleString("fr-FR") : ""}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-[#EDE4CF]">
                        <div>
                          <span className="text-[#C5A059] font-cinzel block mb-1">Coordonnées :</span>
                          <p>📧 Email : <a href={`mailto:${d.email}`} className="text-[#E9D18F] underline">{d.email}</a></p>
                          {d.phone && (
                            <p>📞 Tél : <a href={`tel:${d.phone}`} className="text-[#E9D18F] underline">{d.phone}</a></p>
                          )}
                        </div>
                        <div>
                          <span className="text-[#C5A059] font-cinzel block mb-1">Sujet :</span>
                          <p className="font-semibold text-[#E9D18F]">{d.subject || "Demande de contact"}</p>
                        </div>
                      </div>

                      {d.message && (
                        <div className="p-4 rounded-xl bg-[#0d0e0d] border border-[#C5A059]/20 font-cormorant text-base text-[#EDE4CF] whitespace-pre-wrap leading-relaxed">
                          {d.message}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-3 pt-2 flex-wrap">
                        <a
                          href={`mailto:${d.email}?subject=${encodeURIComponent(
                            `Réponse General Esquire — ${d.subject || "Votre demande"}`
                          )}`}
                          className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#E9D18F] text-black font-cinzel font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          ✉️ {lang === "fr" ? "Répondre par Email" : "Reply via Email"}
                        </a>

                        {d.phone && (
                          <a
                            href={`https://wa.me/${d.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-cinzel font-bold text-xs transition-colors flex items-center gap-1.5"
                          >
                            💬 WhatsApp
                          </a>
                        )}

                        <button
                          onClick={() => handleToggleDemandeStatus(d.id, d.status)}
                          className="px-4 py-2 rounded-xl bg-[#1f2d22] hover:bg-[#2e4533] text-emerald-400 font-cinzel font-semibold text-xs border border-emerald-500/30 transition-colors"
                        >
                          {d.status === "Traité" ? "↩️ Marquer Nouveau" : "✅ Marquer Traité"}
                        </button>

                        <button
                          onClick={() => handleDeleteDemande(d.id)}
                          className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 font-cinzel font-semibold text-xs border border-red-500/30 transition-colors"
                        >
                          🗑️ {lang === "fr" ? "Supprimer" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="p-8 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-3xl text-center space-y-4">
            <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">Historique des Paiements</h3>
            <p className="text-sm text-[#cabfa6]">Les règlements en ligne et virements enregistrés sont répertoriés ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}
