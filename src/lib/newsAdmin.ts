import { supabase } from "@/lib/supabase";
import { NewsItem } from "@/data/adminStore";

/**
 * Gestion administrateur des actualités via l'Edge Function Supabase `manage-news`
 * (service_role côté serveur, accès vérifié par le JWT Supabase Auth de l'admin
 * connecté — contrairement à `cloudNewsStore.ts` qui ne lit que les articles publiés).
 */
async function invokeManageNews(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("manage-news", { body });
  if (error) throw error;
  if (data && data.success === false) throw new Error(data.error || "Erreur manage-news");
  return data;
}

export async function adminListNews(): Promise<NewsItem[]> {
  const data = await invokeManageNews({ action: "list" });
  return data.news || [];
}

export async function adminCreateNews(article: Partial<NewsItem>): Promise<NewsItem> {
  const data = await invokeManageNews({ action: "create", article });
  return data.article;
}

export async function adminUpdateNews(id: string, article: Partial<NewsItem>): Promise<NewsItem> {
  const data = await invokeManageNews({ action: "update", id, article });
  return data.article;
}

export async function adminDeleteNews(id: string): Promise<void> {
  await invokeManageNews({ action: "delete", id });
}
