import { NewsItem } from "@/data/adminStore";

const CLOUD_STORE_URL = "https://api.restful-api.dev/objects/ff8081819f7e10ae019fb50798a7509f";

export async function getCloudNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(CLOUD_STORE_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.news)) {
        return data.data.news;
      }
    }
  } catch (err) {
    console.error("Error fetching cloud news:", err);
  }
  return [];
}

export async function updateCloudNews(newsList: NewsItem[]): Promise<boolean> {
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
    console.error("Error updating cloud news:", err);
    return false;
  }
}
