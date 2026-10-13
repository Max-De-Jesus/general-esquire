import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Comptes administrateurs autorisés à agir via les Edge Functions.
// Correspondance stricte (pas de "includes") — contrairement au contrôle
// côté client dans AuthContext.tsx, qui reste plus permissif par ailleurs.
const ADMIN_EMAILS = [
  "admin@generalesquire.com",
  "generalesquire@proton.me",
  "contact@generalesquire.com",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

/**
 * Vérifie le JWT Supabase Auth transmis dans l'en-tête Authorization de la requête
 * et confirme que l'utilisateur authentifié correspond à un email administrateur.
 * Retourne l'utilisateur si autorisé, sinon null.
 */
export async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const client = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data, error } = await client.auth.getUser();
  if (error || !data?.user || !isAdminEmail(data.user.email)) {
    return null;
  }
  return data.user;
}

/** Client Supabase avec la clé service_role (contourne RLS) — usage strictement serveur. */
export function serviceRoleClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(supabaseUrl, serviceKey);
}
