/**
 * Envoi de notifications e-mail transactionnelles via l'Edge Function Supabase
 * `send-notification`, qui gère elle-même le multi-canal (FormSubmit / Resend / Web3Forms)
 * et conserve les clés d'API côté serveur uniquement.
 */
import { supabase } from "@/lib/supabase";

export const ADMIN_NOTIFY_EMAIL = "generalesquire@proton.me";

export async function sendEmailNotification(
  targetEmail: string = ADMIN_NOTIFY_EMAIL,
  payload: Record<string, unknown>
): Promise<boolean> {
  const cleanEmail = targetEmail?.trim() || ADMIN_NOTIFY_EMAIL;

  try {
    const { data, error } = await supabase.functions.invoke("send-notification", {
      body: { targetEmail: cleanEmail, payload },
    });

    if (error) {
      console.warn("[send-notification] invoke error:", error);
      return false;
    }

    return Boolean(data?.success);
  } catch (err) {
    console.warn("[send-notification] exception:", err);
    return false;
  }
}
