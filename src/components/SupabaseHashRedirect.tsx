"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Ce composant s'exécute sur toutes les pages.
 * Supabase redirige parfois le lien de réinitialisation vers la page d'accueil
 * avec le token dans le hash d'URL (ex: /#access_token=...&type=recovery).
 * Ce composant détecte ce cas et redirige vers la bonne page.
 */
export default function SupabaseHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    // Analyser les paramètres du hash
    const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
    const type = hashParams.get("type");
    const accessToken = hashParams.get("access_token");

    // Rediriger vers la page de réinitialisation si c'est un lien recovery
    if (type === "recovery" && accessToken) {
      // Préserver le hash complet pour que Supabase puisse lire le token
      const targetUrl = `/reinitialisation-mot-de-passe${hash}`;
      window.location.replace(targetUrl);
    }
  }, []);

  return null;
}
