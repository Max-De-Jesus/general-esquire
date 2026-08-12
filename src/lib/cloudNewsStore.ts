import { supabase, Actualite } from "@/lib/supabase";
import { NewsItem } from "@/data/adminStore";

function toNewsItem(row: Actualite): NewsItem {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    summary: row.summary,
    content: row.content,
    category: row.category,
    date: row.date,
    imageUrl: row.image_url,
    images: row.images ?? undefined,
    author: row.author,
    isFeatured: row.is_featured,
    isPublished: row.is_published,
  };
}

/**
 * Lecture publique des actualités publiées, directement depuis la table Supabase
 * `actualites` (RLS : is_published = true). Utilisé par les pages publiques
 * (actualités, accueil). Pour la gestion admin (brouillons inclus, écriture),
 * voir `@/lib/newsAdmin`.
 */
export async function getCloudNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("actualites")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.warn("Erreur lecture actualites Supabase:", error.message);
    return [];
  }

  return (data ?? []).map(toNewsItem);
}
