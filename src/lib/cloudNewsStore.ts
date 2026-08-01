import { NewsItem } from "@/data/adminStore";

const CLOUD_STORE_URL = "https://api.restful-api.dev/objects/ff8081819f7e10ae019fb50798a7509f";
const LOCAL_STORAGE_KEY = "ge_admin_news";

export async function getCloudNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(CLOUD_STORE_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.news)) {
        // Cache locally for offline/resilience
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.data.news));
        }
        return data.data.news;
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
        return JSON.parse(localStored);
      }
    }
  } catch {
    // Ignore
  }

  return [];
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
