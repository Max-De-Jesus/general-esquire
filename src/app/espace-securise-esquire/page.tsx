"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { supabase, Client } from "@/lib/supabase";
import { NewsItem } from "@/data/adminStore";
import { getCloudNews, updateCloudNews } from "@/lib/cloudNewsStore";
import { logActivity, getActivityLogs, ActivityLogEntry } from "@/lib/activityLog";

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
            width = maxDimension;
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
  const [activeTab, setActiveTab] = useState<"news" | "clients" | "requests" | "payments" | "logs">("clients");

  // News Manager State
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [savingNews, setSavingNews] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState("");
  const [newsError, setNewsError] = useState("");

  // New Article Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formCategory, setFormCategory] = useState<NewsItem["category"]>("Veille Juridique");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formAuthor, setFormAuthor] = useState("Administration General Esquire");
  const [formSummary, setFormSummary] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);

  // Clients & Accounts State
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [clientStatusFilter, setClientStatusFilter] = useState<"Tous" | "En attente de validation" | "Accepté" | "Refusé">("Tous");
  const [selectedClientModal, setSelectedClientModal] = useState<Client | null>(null);

  // Refusal Modal Custom Reason State
  const [refusalModalTarget, setRefusalModalTarget] = useState<Client | null>(null);
  const [refusalReasonInput, setRefusalReasonInput] = useState("");

  // Demandes (Form Submissions) State
  const [demandesList, setDemandesList] = useState<any[]>([]);
  const [loadingDemandes, setLoadingDemandes] = useState(false);
  const [demandesFilter, setDemandesFilter] = useState("");

  // Paiements State
  const [paiementsList, setPaiementsList] = useState<any[]>([]);
  const [loadingPaiements, setLoadingPaiements] = useState(false);

  // Audit Logs State
  const [logsList, setLogsList] = useState<ActivityLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Fetch News Articles
  const fetchNewsList = async () => {
    setLoadingNews(true);
    try {
      const data = await getCloudNews();
      setNewsList(data || []);
    } catch {
      // Ignore
    } finally {
      setLoadingNews(false);
    }
  };

  // Fetch Clients from Supabase
  const fetchClientsList = async () => {
    setLoadingClients(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("registered_at", { ascending: false });

      if (!error && data) {
        setClientsList(data as Client[]);
      }
    } catch (err) {
      console.warn("Clients fetch warning:", err);
    } finally {
      setLoadingClients(false);
    }
  };

  // Fetch Contact Demandes
  const fetchDemandesList = async () => {
    setLoadingDemandes(true);
    try {
      const { data } = await supabase
        .from("demandes_clients")
        .select("*")
        .order("registered_at", { ascending: false });
      if (data) setDemandesList(data);
    } catch {
      // Ignore
    } finally {
      setLoadingDemandes(false);
    }
  };

  // Fetch Paiements
  const fetchPaiementsList = async () => {
    setLoadingPaiements(true);
    try {
      const { data } = await supabase
        .from("paiements")
        .select("*")
        .order("paid_at", { ascending: false });
      if (data) setPaiementsList(data);
    } catch {
      // Ignore
    } finally {
      setLoadingPaiements(false);
    }
  };

  // Fetch Activity Logs
  const fetchLogsList = async () => {
    setLoadingLogs(true);
    try {
      const logs = await getActivityLogs();
      setLogsList(logs);
    } catch {
      // Ignore
    } finally {
      setLoadingLogs(false);
    }
  };

  // Load Data on Mount & Realtime Supabase Subscriptions
  useEffect(() => {
    fetchNewsList();
    if (isAdmin) {
      fetchClientsList();
      fetchDemandesList();
      fetchPaiementsList();
      fetchLogsList();

      // Realtime Subscriptions setup & teardown
      const channel = supabase
        .channel("admin_dashboard_realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, (payload) => {
          fetchClientsList();
          if (payload.eventType === "INSERT") {
            showToast(`🔔 Nouvelle inscription client : ${payload.new?.full_name || payload.new?.email}`, "info");
          }
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "demandes_clients" }, () => {
          fetchDemandesList();
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "paiements" }, () => {
          fetchPaiementsList();
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "activity_logs" }, () => {
          fetchLogsList();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin]);

  // Handle Client Status Action (Accepter, Refuser, En attente)
  const handleUpdateClientStatus = async (
    targetClient: Client,
    newStatus: "Accepté" | "Refusé" | "En attente de validation",
    customReason = ""
  ) => {
    try {
      // 1. Update status in Supabase DB
      const { error } = await supabase
        .from("clients")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("email", targetClient.email);

      if (error) {
        throw new Error(error.message);
      }

      // Local state update for instant UI feedback
      setClientsList((prev) =>
        prev.map((c) => (c.email === targetClient.email ? { ...c, status: newStatus } : c))
      );

      // 2. Audit Log Entry
      await logActivity({
        admin_email: user?.email || "generalesquire@proton.me",
        action_type: newStatus === "Accepté" ? "Validation compte" : newStatus === "Refusé" ? "Refus compte" : "Mise en attente",
        client_name: targetClient.full_name || "Client",
        client_email: targetClient.email,
        notes: customReason ? `Motif de la décision : ${customReason}` : `Statut mis à jour vers '${newStatus}'`,
      });
      fetchLogsList();

      // 3. Dispatch Automated Decision Email to Client
      try {
        await fetch("/api/admin/notify-client", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientEmail: targetClient.email,
            clientName: targetClient.full_name,
            action: newStatus,
            reason: customReason,
            adminEmail: user?.email || "generalesquire@proton.me",
          }),
        });
      } catch (notifyErr) {
        console.warn("Client email notification error:", notifyErr);
      }

      showToast(`Statut du compte de ${targetClient.full_name || targetClient.email} mis à jour : ${newStatus}`);
    } catch (err: any) {
      showToast(`Erreur lors de la mise à jour du statut : ${err.message || "Erreur inconnue"}`, "error");
    }
  };

  // Multiple Image File Upload (compressed DataURL / base64)
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

  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Login handler
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

  // Create / Publish New Article
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

    const updated = [newItem, ...newsList];
    setNewsList(updated);
    try {
      localStorage.setItem("ge_admin_news", JSON.stringify(updated));
    } catch {}

    await updateCloudNews(updated);
    setNewsSuccess(lang === "fr" ? "Actualité publiée avec succès !" : "News article published successfully!");

    setFormTitle("");
    setFormSubtitle("");
    setFormSummary("");
    setFormContent("");
    setFormImages([]);
    setUrlInput("");
    setFormIsFeatured(false);
    setSavingNews(false);
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm(lang === "fr" ? "Voulez-vous vraiment supprimer cette actualité ?" : "Are you sure you want to delete this news article?")) return;

    const updated = newsList.filter((item) => item.id !== id);
    setNewsList(updated);
    try {
      localStorage.setItem("ge_admin_news", JSON.stringify(updated));
    } catch {}

    await updateCloudNews(updated);
    setNewsSuccess(lang === "fr" ? "Actualité supprimée !" : "News article deleted!");
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

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-950/70 border border-rose-500/60 rounded-2xl text-rose-200 text-xs font-cinzel text-center">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-950/70 border border-emerald-500/60 rounded-2xl text-emerald-200 text-xs font-cinzel text-center">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                Identifiant / Courriel Administrateur
              </label>
              <input
                type="email"
                required
                placeholder="admin@generalesquire.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                Mot de Passe Sécurisé
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C5A059] text-xs font-cinzel"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] text-black font-cinzel font-bold text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {submitting ? "Vérification des accès..." : "🔑 Se Connecter au Portail"}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-[#C5A059]/20 text-center">
            <Link href="/" className="text-xs text-[#C5A059] font-cinzel hover:text-[#E9D18F] transition-colors">
              ← Retour au site principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Dashboard KPI Stats
  const pendingCount = clientsList.filter(
    (c) => c.status === "En attente de validation" || c.status === "En attente" || !c.status
  ).length;
  const approvedCount = clientsList.filter((c) =>
    ["Accepté", "Accepte", "Confirmé", "Validé", "Approuvé"].includes(c.status)
  ).length;
  const rejectedCount = clientsList.filter((c) => c.status === "Refusé").length;
  const totalCount = clientsList.length;

  // Filter clients for tab table
  const filteredClients = clientsList.filter((c) => {
    // 1. Status Filter
    if (clientStatusFilter === "En attente de validation") {
      if (c.status !== "En attente de validation" && c.status !== "En attente" && c.status) return false;
    } else if (clientStatusFilter === "Accepté") {
      if (!["Accepté", "Accepte", "Confirmé", "Validé", "Approuvé"].includes(c.status)) return false;
    } else if (clientStatusFilter === "Refusé") {
      if (c.status !== "Refusé") return false;
    }

    // 2. Search Query Filter
    if (!clientSearchQuery.trim()) return true;
    const q = clientSearchQuery.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.profile_type?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#131513] text-[#EDE4CF]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-2xl shadow-2xl font-cinzel text-xs font-bold border flex items-center gap-3 animate-fadeIn ${
            toastMessage.type === "error"
              ? "bg-rose-950 text-rose-200 border-rose-500"
              : toastMessage.type === "info"
              ? "bg-blue-950 text-blue-200 border-blue-500"
              : "bg-emerald-950 text-emerald-200 border-emerald-500"
          }`}
        >
          <span>{toastMessage.type === "error" ? "⚠️" : toastMessage.type === "info" ? "ℹ️" : "✅"}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="bg-[#1a1c1a] border-b border-[#C5A059]/40 py-4 px-6 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 p-1 bg-[#131513] rounded-full border border-[#C5A059]/70">
              <Image src="/images/logo.png" alt="Logo" fill className="object-contain p-1" />
            </div>
            <div>
              <h1 className="font-cinzel text-lg font-bold text-[#E9D18F] tracking-wider">
                GENERAL ESQUIRE — Administration
              </h1>
              <p className="text-[10px] text-[#cabfa6] font-cinzel tracking-widest">
                Portail de Gestion & Contrôle des Inscriptions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[#E9D18F] font-cinzel hidden md:inline">
              👤 {user.email}
            </span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-cinzel text-xs font-bold hover:bg-rose-900 transition-colors cursor-pointer"
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Realtime KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-5 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-2xl text-center space-y-1 shadow-lg">
            <span className="text-[10px] font-cinzel text-[#C5A059] uppercase tracking-wider block">Total Comptes</span>
            <div className="text-2xl font-extrabold text-[#E9D18F]">{totalCount}</div>
            <span className="text-[10px] text-[#cabfa6]">Inscrits plateforme</span>
          </div>

          <div className="p-5 bg-[#1a1c1a] border-2 border-amber-500/60 rounded-2xl text-center space-y-1 shadow-lg">
            <span className="text-[10px] font-cinzel text-amber-400 uppercase tracking-wider block">En attente</span>
            <div className="text-2xl font-extrabold text-amber-400">{pendingCount}</div>
            <span className="text-[10px] text-amber-200/80">À examiner</span>
          </div>

          <div className="p-5 bg-[#1a1c1a] border-2 border-emerald-500/60 rounded-2xl text-center space-y-1 shadow-lg">
            <span className="text-[10px] font-cinzel text-emerald-400 uppercase tracking-wider block">Acceptés</span>
            <div className="text-2xl font-extrabold text-emerald-400">{approvedCount}</div>
            <span className="text-[10px] text-emerald-200/80">Paiement débloqué</span>
          </div>

          <div className="p-5 bg-[#1a1c1a] border-2 border-rose-500/60 rounded-2xl text-center space-y-1 shadow-lg">
            <span className="text-[10px] font-cinzel text-rose-400 uppercase tracking-wider block">Refusés</span>
            <div className="text-2xl font-extrabold text-rose-400">{rejectedCount}</div>
            <span className="text-[10px] text-rose-200/80">Non autorisés</span>
          </div>

          <div className="p-5 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-2xl text-center space-y-1 shadow-lg">
            <span className="text-[10px] font-cinzel text-[#C5A059] uppercase tracking-wider block">Demandes</span>
            <div className="text-2xl font-extrabold text-[#EDE4CF]">{demandesList.length}</div>
            <span className="text-[10px] text-[#cabfa6]">Messages reçus</span>
          </div>

          <div className="p-5 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-2xl text-center space-y-1 shadow-lg">
            <span className="text-[10px] font-cinzel text-[#C5A059] uppercase tracking-wider block">Paiements</span>
            <div className="text-2xl font-extrabold text-[#EDE4CF]">{paiementsList.length}</div>
            <span className="text-[10px] text-[#cabfa6]">Transactions</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#C5A059]/30 pb-4 font-cinzel text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "clients"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-lg scale-105"
                : "bg-[#1a1c1a] text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#242724]"
            }`}
          >
            <span>👥 Comptes Clients ({clientsList.length})</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === "news"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-lg scale-105"
                : "bg-[#1a1c1a] text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#242724]"
            }`}
          >
            📰 Actualités & Publications ({newsList.length})
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-lg scale-105"
                : "bg-[#1a1c1a] text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#242724]"
            }`}
          >
            📩 Demandes & Formulaires ({demandesList.length})
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === "payments"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-lg scale-105"
                : "bg-[#1a1c1a] text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#242724]"
            }`}
          >
            💳 Paiements Reçus ({paiementsList.length})
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`px-5 py-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === "logs"
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black shadow-lg scale-105"
                : "bg-[#1a1c1a] text-[#cabfa6] hover:text-[#E9D18F] hover:bg-[#242724]"
            }`}
          >
            📜 Journal d'Activité ({logsList.length})
          </button>
        </div>

        {/* ===== TAB 1: GESTION DES COMPTES CLIENTS ===== */}
        {activeTab === "clients" && (
          <div className="space-y-6">
            {/* Search & Filter Header Bar */}
            <div className="p-6 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-3xl space-y-4 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-[#E9D18F] flex items-center gap-2">
                    <span>📋</span>
                    <span>Validation & Supervision des Inscriptions Clients</span>
                  </h3>
                  <p className="text-xs text-[#cabfa6] font-cormorant mt-1">
                    Examinez les demandes d'inscription, validez ou refusez les accès au paiement avec notification par email.
                  </p>
                </div>

                <button
                  onClick={fetchClientsList}
                  className="px-4 py-2 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#E9D18F] text-xs font-cinzel font-bold border border-[#C5A059]/40 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  🔄 <span>Actualiser en Temps Réel</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {/* Text Search Box */}
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="🔍 Rechercher par nom, email, téléphone ou profil..."
                    value={clientSearchQuery}
                    onChange={(e) => setClientSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-xs text-[#EDE4CF] focus:outline-none focus:border-[#E9D18F]"
                  />
                </div>

                {/* Status Filter Buttons */}
                <div className="md:col-span-2 flex flex-wrap gap-2">
                  {(["Tous", "En attente de validation", "Accepté", "Refusé"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setClientStatusFilter(st)}
                      className={`px-3 py-2 rounded-xl text-xs font-cinzel font-bold transition-all cursor-pointer ${
                        clientStatusFilter === st
                          ? "bg-[#C5A059] text-black shadow-md"
                          : "bg-[#131513] text-[#cabfa6] border border-[#C5A059]/30 hover:border-[#C5A059]"
                      }`}
                    >
                      {st === "Tous" && "🌐 Tous"}
                      {st === "En attente de validation" && "🟠 En attente"}
                      {st === "Accepté" && "🟢 Accepté"}
                      {st === "Refusé" && "🔴 Refusé"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clients Table / Cards List */}
            {loadingClients ? (
              <div className="p-12 text-center text-[#C5A059] font-cinzel text-sm animate-pulse">
                Chargement des comptes clients...
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="p-12 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-3xl text-center space-y-3">
                <div className="text-4xl text-[#C5A059]">👥</div>
                <h4 className="font-cinzel text-lg font-bold text-[#E9D18F]">Aucun compte correspondant</h4>
                <p className="text-xs text-[#cabfa6] max-w-md mx-auto">
                  Aucun client n'a été trouvé avec les filtres actuels.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClients.map((c) => {
                  const statusNormalized =
                    c.status === "Refusé"
                      ? "Refusé"
                      : ["Accepté", "Accepte", "Confirmé", "Validé", "Approuvé"].includes(c.status)
                      ? "Accepté"
                      : "En attente de validation";

                  return (
                    <div
                      key={c.id || c.email}
                      className="p-6 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-2xl shadow-xl hover:border-[#C5A059]/70 transition-all space-y-4"
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#C5A059]/20 pb-4">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="font-cinzel font-bold text-lg text-[#E9D18F]">
                              {c.full_name || "Nom non spécifié"}
                            </h4>
                            <span className="px-3 py-1 rounded-full bg-[#0F3823] text-emerald-300 border border-emerald-500/40 text-[11px] font-cinzel font-bold">
                              {c.profile_type || "Particulier"}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-cinzel font-bold uppercase tracking-wider ${
                                statusNormalized === "Accepté"
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-500/60"
                                  : statusNormalized === "Refusé"
                                  ? "bg-rose-950 text-rose-400 border border-rose-500/60"
                                  : "bg-amber-950 text-amber-400 border border-amber-500/60"
                              }`}
                            >
                              {statusNormalized === "Accepté" && "🟢 Accepté"}
                              {statusNormalized === "Refusé" && "🔴 Refusé"}
                              {statusNormalized === "En attente de validation" && "🟠 En attente de validation"}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-xs font-cormorant text-[#EDE4CF]/90 mt-2">
                            <span>📧 <strong>Email :</strong> <a href={`mailto:${c.email}`} className="text-[#E9D18F] underline">{c.email}</a></span>
                            {c.phone && <span>📞 <strong>Tél :</strong> <a href={`tel:${c.phone}`} className="text-[#E9D18F] underline">{c.phone}</a></span>}
                            <span>📅 <strong>Inscription :</strong> {c.registered_at ? new Date(c.registered_at).toLocaleString("fr-FR") : "Date inconnue"}</span>
                          </div>
                        </div>

                        {/* Action Buttons: Accepter / Refuser / En attente */}
                        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
                          <button
                            onClick={() => setSelectedClientModal(c)}
                            className="px-3.5 py-2 rounded-xl bg-[#131513] border border-[#C5A059]/40 text-[#EDE4CF] font-cinzel text-xs font-bold hover:border-[#E9D18F] transition-colors cursor-pointer"
                          >
                            👁️ Fiche
                          </button>

                          <button
                            onClick={() => handleUpdateClientStatus(c, "Accepté")}
                            disabled={statusNormalized === "Accepté"}
                            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white font-cinzel text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            🟢 Accepter
                          </button>

                          <button
                            onClick={() => {
                              setRefusalModalTarget(c);
                              setRefusalReasonInput("");
                            }}
                            disabled={statusNormalized === "Refusé"}
                            className="px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-700 disabled:opacity-40 text-white font-cinzel text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            🔴 Refuser
                          </button>

                          <button
                            onClick={() => handleUpdateClientStatus(c, "En attente de validation")}
                            disabled={statusNormalized === "En attente de validation"}
                            className="px-3.5 py-2 rounded-xl bg-amber-800/80 hover:bg-amber-700 disabled:opacity-40 text-amber-100 font-cinzel text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            🟠 En attente
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== TAB 2: ACTUALITÉS & PUBLICATIONS ===== */}
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

                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as NewsItem["category"])}
                      className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                    >
                      <option value="Veille Juridique">Veille Juridique</option>
                      <option value="Espace Activités">Espace Activités</option>
                      <option value="Événementiels">Événementiels</option>
                      <option value="Communiqués">Communiqués</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                      Date de Publication *
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F] [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                    Résumé / Accroche *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Synthèse claire apparaissant sur la carte..."
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                    Contenu Complet de l'Article *
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Rédigez ici l'intégralité du texte..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-4 py-3 bg-[#131513] border border-[#C5A059]/40 rounded-xl text-[#EDE4CF] text-sm focus:outline-none focus:border-[#E9D18F]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingNews}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] text-black font-cinzel font-bold text-sm uppercase tracking-widest shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingNews ? "Publication en cours..." : "🚀 Publier l'Actualité"}
                </button>
              </form>
            </div>

            {/* Liste des Actualités */}
            <div className="p-8 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-3xl shadow-xl space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-[#E9D18F] flex items-center justify-between">
                <span>📚 Liste des Actualités Publiées ({newsList.length})</span>
                <button onClick={fetchNewsList} className="text-xs font-cinzel text-[#C5A059] hover:text-[#E9D18F]">
                  🔄 Actualiser
                </button>
              </h3>

              {newsList.map((item) => (
                <div key={item.id} className="p-5 bg-[#131513] border border-[#C5A059]/30 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-cinzel text-base font-bold text-[#EDE4CF]">{item.title}</h4>
                    <p className="text-xs text-[#cabfa6]">{item.date} — {item.category}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="px-4 py-2 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-bold"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB 3: DEMANDES DE CONTACT ===== */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="p-6 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-2xl flex items-center justify-between">
              <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">Demandes de Contact Reçues ({demandesList.length})</h3>
              <button onClick={fetchDemandesList} className="text-xs text-[#C5A059] font-cinzel font-bold">↻ Actualiser</button>
            </div>

            <div className="space-y-4">
              {demandesList.map((d) => (
                <div key={d.id} className="p-6 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-2xl space-y-2">
                  <div className="flex justify-between font-cinzel font-bold text-[#E9D18F]">
                    <span>{d.full_name || "Client"} ({d.email})</span>
                    <span className="text-xs text-gray-400">{d.registered_at ? new Date(d.registered_at).toLocaleString("fr-FR") : ""}</span>
                  </div>
                  <p className="text-xs text-[#C5A059]">Sujet : {d.subject}</p>
                  <p className="text-sm text-[#EDE4CF]">{d.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB 4: PAIEMENTS REÇUS ===== */}
        {activeTab === "payments" && (
          <div className="p-8 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-3xl text-center space-y-4">
            <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">Historique des Paiements Reçus ({paiementsList.length})</h3>
            {paiementsList.length === 0 ? (
              <p className="text-sm text-[#cabfa6]">Aucun paiement enregistré pour le moment.</p>
            ) : (
              <div className="space-y-3 text-left">
                {paiementsList.map((p) => (
                  <div key={p.id} className="p-4 bg-[#131513] border border-[#C5A059]/30 rounded-xl flex justify-between">
                    <div>
                      <span className="font-bold text-[#E9D18F]">{p.client_name} ({p.client_email})</span>
                      <p className="text-xs text-[#cabfa6]">{p.service} — {p.payment_method}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">{p.amount} €</span>
                      <p className="text-[10px] text-gray-400">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== TAB 5: JOURNAL D'ACTIVITÉ (AUDIT TRAIL) ===== */}
        {activeTab === "logs" && (
          <div className="space-y-6">
            <div className="p-6 bg-[#1a1c1a] border border-[#C5A059]/40 rounded-3xl flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#E9D18F] flex items-center gap-2">
                  <span>📜</span>
                  <span>Journal d'Activité & Traçabilité (Audit Trail)</span>
                </h3>
                <p className="text-xs text-[#cabfa6] font-cormorant mt-1">
                  Historique complet des actions administratives (Validations, Refus, Mises en attente, Notifications).
                </p>
              </div>

              <button
                onClick={fetchLogsList}
                className="px-4 py-2 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#E9D18F] text-xs font-cinzel font-bold border border-[#C5A059]/40 transition-colors"
              >
                ↻ Actualiser
              </button>
            </div>

            {loadingLogs ? (
              <div className="p-12 text-center text-[#C5A059] font-cinzel text-sm animate-pulse">
                Chargement de l'historique des actions...
              </div>
            ) : logsList.length === 0 ? (
              <div className="p-12 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-3xl text-center space-y-2">
                <div className="text-3xl text-[#C5A059]">📜</div>
                <p className="text-sm text-[#cabfa6]">Aucun événement enregistré dans le journal d'activité.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logsList.map((log) => (
                  <div
                    key={log.id}
                    className="p-5 bg-[#1a1c1a] border border-[#C5A059]/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#E9D18F] font-cinzel font-bold">
                          {log.action_type}
                        </span>
                        <span className="font-semibold text-white">Client : {log.client_name} ({log.client_email})</span>
                      </div>
                      {log.notes && <p className="text-[#cabfa6] italic">{log.notes}</p>}
                    </div>

                    <div className="text-right text-[#cabfa6] font-mono flex flex-col items-start md:items-end">
                      <span>👤 Admin : {log.admin_email}</span>
                      <span>⏱️ {log.created_at ? new Date(log.created_at).toLocaleString("fr-FR") : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: FICHE CLIENT COMPLÈTE */}
      {selectedClientModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1c1a] border-2 border-[#C5A059] rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative animate-fadeIn">
            <button
              onClick={() => setSelectedClientModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-[#C5A059]/30 pb-4">
              <span className="text-3xl">👤</span>
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">
                  {selectedClientModal.full_name || "Fiche Client"}
                </h3>
                <p className="text-xs text-[#cabfa6]">Informations complètes enregistrées</p>
              </div>
            </div>

            <div className="space-y-3 text-sm font-cormorant text-[#EDE4CF]">
              <div><strong className="text-[#C5A059]">Email :</strong> {selectedClientModal.email}</div>
              <div><strong className="text-[#C5A059]">Téléphone :</strong> {selectedClientModal.phone || "Non renseigné"}</div>
              <div><strong className="text-[#C5A059]">Profil :</strong> {selectedClientModal.profile_type || "Particulier"}</div>
              <div>
                <strong className="text-[#C5A059]">Statut actuel :</strong>{" "}
                <span className="font-bold text-amber-400">{selectedClientModal.status || "En attente de validation"}</span>
              </div>
              <div><strong className="text-[#C5A059]">Date d'inscription :</strong> {selectedClientModal.registered_at ? new Date(selectedClientModal.registered_at).toLocaleString("fr-FR") : "Date inconnue"}</div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-[#C5A059]/30">
              <button
                onClick={() => {
                  handleUpdateClientStatus(selectedClientModal, "Accepté");
                  setSelectedClientModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-cinzel text-xs font-bold hover:bg-emerald-600"
              >
                🟢 Accepter
              </button>
              <button
                onClick={() => setSelectedClientModal(null)}
                className="px-4 py-2 rounded-xl bg-[#131513] text-[#EDE4CF] font-cinzel text-xs border border-[#C5A059]/40"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MOTIF DE REFUS SUR-MESURE */}
      {refusalModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1c1a] border-2 border-rose-500/80 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 relative animate-fadeIn">
            <h3 className="font-cinzel text-xl font-bold text-rose-300 flex items-center gap-2">
              <span>🛑</span>
              <span>Refuser l'Inscription Client</span>
            </h3>

            <p className="text-xs text-[#EDE4CF] font-cormorant leading-relaxed">
              Vous êtes sur le point de refuser la demande d'inscription de <strong>{refusalModalTarget.full_name || refusalModalTarget.email}</strong>.
              Un email de notification automatique lui sera transmis.
            </p>

            <div>
              <label className="block text-xs font-cinzel font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
                Motif personnalisé du refus (Optionnel)
              </label>
              <textarea
                rows={3}
                placeholder="Précisez le motif du refus transmis au client dans l'email..."
                value={refusalReasonInput}
                onChange={(e) => setRefusalReasonInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#131513] border border-rose-500/40 rounded-xl text-[#EDE4CF] text-xs focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRefusalModalTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-[#131513] text-[#cabfa6] font-cinzel text-xs font-bold border border-[#C5A059]/30"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleUpdateClientStatus(refusalModalTarget, "Refusé", refusalReasonInput);
                  setRefusalModalTarget(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-cinzel text-xs font-bold shadow-lg"
              >
                Confirmé le Refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
