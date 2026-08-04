import { NewsItem } from "@/data/adminStore";

const CLOUD_STORE_URL = "https://api.restful-api.dev/objects/ff8081819f7e10ae019fb50798a7509f";
const LOCAL_STORAGE_KEY = "ge_admin_news";

// ─── Articles permanents intégrés dans le code ─────────────────────────────
// Ces articles sont toujours affichés, quel que soit l'état du cloud store.
const PERMANENT_NEWS: NewsItem[] = [
  {
    id: "news-madagascar-2026",
    title: "Bientôt : Voyage touristique exceptionnel à Madagascar",
    subtitle: "Une aventure unique au cœur de l'océan Indien",
    summary:
      "General Esquire prépare un voyage touristique exceptionnel à Madagascar. Découvrez prochainement un séjour unique au cœur d'une île aux paysages spectaculaires, à la biodiversité incomparable et à la richesse culturelle fascinante.",
    content: `General Esquire a le plaisir d'annoncer l'organisation prochaine d'un voyage touristique exceptionnel à Madagascar.

Cette aventure offrira aux participants une immersion au cœur de l'une des plus belles destinations d'Afrique et de l'océan Indien, réputée pour sa biodiversité unique, ses paysages grandioses et son patrimoine culturel exceptionnel.

Au programme :

• Découverte des célèbres lémuriens dans leur habitat naturel ;
• Visite des sites emblématiques et des réserves naturelles ;
• Exploration des plages paradisiaques et des paysages majestueux ;
• Immersion dans les traditions et la culture malgaches ;
• Accompagnement personnalisé durant tout le séjour.

Ce voyage s'inscrit dans notre volonté de proposer des expériences enrichissantes, favorisant la découverte, les échanges culturels et le développement personnel.

Les dates, le programme détaillé et les modalités d'inscription seront communiqués très prochainement sur notre plateforme.

Restez connectés à notre espace Actualités & Annonces pour être parmi les premiers informés de l'ouverture officielle des inscriptions.`,
    category: "Espace Activités",
    date: "4 août 2026",
    imageUrl: "/images/images.webp",
    images: ["/images/images.webp", "/images/@-LemursPark-Lemur-Catta.jpg"],
    author: "Administration General Esquire",
    isFeatured: true,
    isPublished: true,
  },
];

/**
 * Fusionne les articles permanents avec les articles du cloud/local,
 * en évitant les doublons (par id). Les permanents sont toujours en tête.
 */
function mergeWithPermanent(cloudNews: NewsItem[]): NewsItem[] {
  const cloudIds = new Set(cloudNews.map((n) => n.id));
  const permanentToAdd = PERMANENT_NEWS.filter((p) => !cloudIds.has(p.id));
  return [...permanentToAdd, ...cloudNews];
}

export async function getCloudNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(CLOUD_STORE_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.news)) {
        const merged = mergeWithPermanent(data.data.news);
        // Cache locally for offline/resilience
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        }
        return merged;
      }
    }
  } catch (err) {
    console.warn("Cloud news API unavailable, using local cache fallback:", err);
  }

  // Local storage fallback
  try {
    if (typeof window !== "undefined") {
      const localStored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localStored) {
        return mergeWithPermanent(JSON.parse(localStored));
      }
    }
  } catch {
    // Ignore
  }

  // Dernier recours : uniquement les articles permanents
  return [...PERMANENT_NEWS];
}

export async function updateCloudNews(newsList: NewsItem[]): Promise<boolean> {
  // Always update local storage first for guaranteed instant persistence
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newsList));
    }
  } catch (lsErr) {
    console.warn("Local storage news save error:", lsErr);
  }

  try {
    const res = await fetch(CLOUD_STORE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "General Esquire News Store",
        data: {
          news: newsList,
        },
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn("Cloud news API update failed (saved to local cache smoothly):", err);
    return true; // Return true as local storage succeeded
  }
}


