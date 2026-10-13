import { jsonHeaders, corsHeaders } from "../_shared/cors.ts";
import { requireAdmin, serviceRoleClient } from "../_shared/admin.ts";

// deno-lint-ignore no-explicit-any
function toDbRow(item: any) {
  return {
    title: item.title,
    subtitle: item.subtitle ?? null,
    summary: item.summary,
    content: item.content,
    category: item.category,
    date: item.date,
    image_url: item.imageUrl,
    images: Array.isArray(item.images) ? item.images : null,
    author: item.author,
    is_featured: !!item.isFeatured,
    is_published: item.isPublished !== false,
  };
}

// deno-lint-ignore no-explicit-any
function toNewsItem(row: any) {
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: jsonHeaders });
  }

  // Toutes les actions de ce endpoint (y compris la liste complète, brouillons inclus)
  // nécessitent un JWT Supabase Auth valide appartenant à un email administrateur.
  const admin = await requireAdmin(req);
  if (!admin) {
    return new Response(JSON.stringify({ error: "Accès administrateur requis." }), {
      status: 403,
      headers: jsonHeaders,
    });
  }

  const supabase = serviceRoleClient();

  try {
    const body = await req.json();
    const { action, article, id } = body;

    if (action === "list") {
      const { data, error } = await supabase.from("actualites").select("*").order("date", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, news: (data ?? []).map(toNewsItem) }), {
        headers: jsonHeaders,
      });
    }

    if (action === "create") {
      const { data, error } = await supabase.from("actualites").insert(toDbRow(article)).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, article: toNewsItem(data) }), { headers: jsonHeaders });
    }

    if (action === "update") {
      if (!id) throw new Error("id requis pour la mise à jour.");
      const { data, error } = await supabase.from("actualites").update(toDbRow(article)).eq("id", id).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, article: toNewsItem(data) }), { headers: jsonHeaders });
    }

    if (action === "delete") {
      if (!id) throw new Error("id requis pour la suppression.");
      const { error } = await supabase.from("actualites").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: jsonHeaders });
    }

    return new Response(JSON.stringify({ error: "Action inconnue." }), { status: 400, headers: jsonHeaders });
  } catch (err) {
    console.error("manage-news error:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
