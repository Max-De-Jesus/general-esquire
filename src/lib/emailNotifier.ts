/**
 * Envoi de notifications e-mail transactionnelles via l'Edge Function Supabase
 * `send-notification`, avec multi-canal serveur (Resend / FormSubmit / Web3Forms)
 * et mécanisme de bascule de secours direct côté navigateur en cas d'indisponibilité.
 */
import { supabase } from "@/lib/supabase";

export const ADMIN_NOTIFY_EMAIL = "generalesquire@proton.me";

export interface EmailNotificationResult {
  success: boolean;
  message?: string;
  channels?: Array<{ channel: string; success: boolean; detail?: string }>;
  needsActivation?: boolean;
}

/**
 * Envoi direct de secours depuis le navigateur vers FormSubmit
 */
async function directBrowserFallback(
  targetEmail: string,
  payload: Record<string, unknown>
): Promise<{ success: boolean; detail?: string; needsActivation?: boolean }> {
  try {
    const subject = (payload._subject as string) || `[General Esquire] Notification - ${new Date().toLocaleDateString("fr-FR")}`;
    const formSubmitPayload: Record<string, unknown> = {
      _subject: subject,
      _template: "table",
      _captcha: "false",
      _replyto: payload._replyto || payload["Email"] || targetEmail,
    };

    Object.entries(payload)
      .filter(([k]) => !k.startsWith("_"))
      .forEach(([k, v]) => {
        formSubmitPayload[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
      });

    const res = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(formSubmitPayload),
    });

    const resData = await res.json().catch(() => ({}));
    const isSuccess =
      res.ok &&
      (resData?.success === "true" ||
        resData?.success === true ||
        (resData?.message && String(resData.message).toLowerCase().includes("sent")));

    const message = resData?.message || "";
    const needsActivation = message.toLowerCase().includes("activation");

    return {
      success: isSuccess,
      detail: message || (isSuccess ? "Délivré via FormSubmit (Direct)" : `HTTP ${res.status}`),
      needsActivation,
    };
  } catch (err) {
    return { success: false, detail: String(err) };
  }
}

/**
 * Envoie une notification transactionnelle par email
 */
export async function sendEmailNotification(
  targetEmail: string = ADMIN_NOTIFY_EMAIL,
  payload: Record<string, unknown>
): Promise<boolean> {
  const cleanEmail = targetEmail?.trim() || ADMIN_NOTIFY_EMAIL;

  try {
    const { data, error } = await supabase.functions.invoke("send-notification", {
      body: { targetEmail: cleanEmail, payload },
    });

    if (!error && data?.success) {
      return true;
    }

    console.warn("[send-notification] Edge Function n'a pas confirmé l'envoi, bascule sur secours client...", error || data);
  } catch (err) {
    console.warn("[send-notification] Exception Edge Function, bascule sur secours client:", err);
  }

  // Secours direct navigateur
  const fallback = await directBrowserFallback(cleanEmail, payload);
  return fallback.success;
}

/**
 * Exécute un test de diagnostic complet d'envoi d'email et retourne le rapport
 */
export async function testEmailNotification(
  targetEmail: string = ADMIN_NOTIFY_EMAIL
): Promise<EmailNotificationResult> {
  const cleanEmail = targetEmail?.trim() || ADMIN_NOTIFY_EMAIL;
  const testPayload = {
    _subject: `[TEST SYSTÈME] Diagnostic Réception Email General Esquire — ${new Date().toLocaleTimeString("fr-FR")}`,
    "Type de test": "Diagnostic automatique de distribution",
    "Destinataire": cleanEmail,
    "Date & Heure": new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
    "Plateforme": "General Esquire Administration",
    "Message": "Si vous lisez ce message, la distribution d'emails vers votre boîte fonctionne correctement.",
  };

  try {
    const { data, error } = await supabase.functions.invoke("send-notification", {
      body: { targetEmail: cleanEmail, payload: testPayload },
    });

    if (!error && data) {
      const channels = data.channels || [];
      const formSubmitChannel = channels.find((c: any) => c.channel === "FormSubmit");
      const needsActivation =
        formSubmitChannel &&
        formSubmitChannel.detail &&
        String(formSubmitChannel.detail).toLowerCase().includes("activation");

      return {
        success: Boolean(data.success),
        message: data.message || (data.success ? "Email de test transmis avec succès." : "Échec de l'envoi."),
        channels,
        needsActivation: Boolean(needsActivation),
      };
    }
  } catch (invokeErr) {
    console.warn("[testEmailNotification] invoke error:", invokeErr);
  }

  // Diagnostic direct navigateur si l'Edge Function est inaccessible
  const directRes = await directBrowserFallback(cleanEmail, testPayload);
  return {
    success: directRes.success,
    message: directRes.detail || (directRes.success ? "Transmis via secours direct" : "Échec"),
    channels: [{ channel: "Direct Browser (FormSubmit)", success: directRes.success, detail: directRes.detail }],
    needsActivation: Boolean(directRes.needsActivation),
  };
}

