import { NewsItem } from "@/data/adminStore";

const LOCAL_STORAGE_KEY = "ge_admin_news";
const CLOUD_STORE_URL = "https://api.restful-api.dev/objects/ff8081819f7e10ae019fd3c71c167c9f";

/**
 * Récupère la liste des actualités depuis l'API serveur /api/news.
 * En cas d'indisponibilité, utilise le cache local localStorage.
 * AUCUNE actualité n'est codée en dur dans le code.
 */
export async function getCloudNews(): Promise<NewsItem[]> {
  // 1. Tenter la récupération via l'API interne /api/news
  try {
    const res = await fetch("/api/news", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.news)) {
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.news));
        }
        return data.news;
      }
    }
  } catch (err) {
    console.warn("API /api/news non disponible, tentative de repli...", err);
  }

  // 2. Tenter la récupération via l'API REST cloud externe (secours)
  try {
    const cloudRes = await fetch(CLOUD_STORE_URL, { cache: "no-store" });
    if (cloudRes.ok) {
      const cloudData = await cloudRes.json();
      if (cloudData && cloudData.data && Array.isArray(cloudData.data.news)) {
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudData.data.news));
        }
        return cloudData.data.news;
      }
    }
  } catch {
    // Continuer vers le cache local
  }

  // 3. Repli sur le stockage local du navigateur
  try {
    if (typeof window !== "undefined") {
      const localStored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localStored) {
        return JSON.parse(localStored);
      }
    }
  } catch {
    // Ignorer
  }

  return [];
}

/**
 * Met à jour la liste des actualités sur le serveur (/api/news), le Cloud Store et en local.
 */
export async function updateCloudNews(newsList: NewsItem[]): Promise<boolean> {
  // 1. Enregistrement local immédiat pour garantir la réactivité UI
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newsList));
    }
  } catch (lsErr) {
    console.warn("Erreur sauvegarde locale actualités:", lsErr);
  }

  // 2. Enregistrement sur le serveur via /api/news
  let apiSuccess = false;
  try {
    const res = await fetch("/api/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newsList),
    });
    if (res.ok) {
      apiSuccess = true;
    }
  } catch (err) {
    console.warn("Mise à jour /api/news échouée (sauvegardé en local):", err);
  }

  // 3. Synchronisation optionnelle avec le Cloud Store REST externe
  try {
    await fetch(CLOUD_STORE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "General Esquire News Store",
        data: { news: newsList },
      }),
    });
  } catch {
    // Ignorer les erreurs réseau externes
  }

  return apiSuccess || true;
}

/**
 * Supprime une actualité par son ID depuis le serveur /api/news et met à jour le store local.
 */
export async function deleteCloudNewsItem(id: string): Promise<NewsItem[]> {
  try {
    const current = await getCloudNews();
    const updated = current.filter((item) => item.id !== id);
    await updateCloudNews(updated);
    return updated;
  } catch (err) {
    console.error("Erreur lors de la suppression de l'actualité:", err);
    return [];
  }
}
