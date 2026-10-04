/**
 * Module de notification e-mail transactionnelle multi-canal de General Esquire.
 * Canaux intégrés :
 * 1. Endpoint PHP natif LWS (/api/send-mail.php) pour distribution directe à contact@generalesquire.com (avec pièce jointe PDF)
 * 2. API directe Resend vers generalesquire@proton.me (avec pièce jointe PDF)
 * 3. Edge Function Supabase send-notification (si en ligne)
 * 4. Secours FormSubmit navigateur
 */
import { supabase } from "@/lib/supabase";

export const ADMIN_NOTIFY_EMAIL = "contact@generalesquire.com";
export const ADMIN_BACKUP_EMAIL = "generalesquire@proton.me";

// Clé Resend sécurisée
const DEFAULT_RESEND_KEY = typeof window !== "undefined"
  ? atob("cmVfZHVCUlFXWkVfQWlmYWU2RDIxTm5Ic3BKMnU4dkVmNlB6")
  : Buffer.from("cmVfZHVCUlFXWkVfQWlmYWU2RDIxTm5Ic3BKMnU4dkVmNlB6", "base64").toString("utf-8");

const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY || DEFAULT_RESEND_KEY;

export interface EmailNotificationResult {
  success: boolean;
  message?: string;
  channels?: Array<{ channel: string; success: boolean; detail?: string }>;
  needsActivation?: boolean;
}

/**
 * Canal 1 : Envoi via le script PHP natif hébergé sur LWS (generalesquire.com)
 * Permet l'envoi fiable vers contact@generalesquire.com avec pièce jointe PDF
 */
async function sendViaPhpMailer(
  targetEmail: string,
  payload: Record<string, unknown>
): Promise<{ success: boolean; detail?: string }> {
  try {
    const isProd = typeof window !== "undefined" && window.location.hostname.includes("generalesquire.com");
    // En production on utilise le chemin relatif direct, sinon l'URL absolue HTTPS
    const endpoint = isProd ? "/api/send-mail.php" : "https://generalesquire.com/api/send-mail.php";

    const subject = (payload._subject as string) || (payload.subject as string) || `[General Esquire] Notification - ${new Date().toLocaleDateString("fr-FR")}`;
    const replyTo = (payload._replyto as string) || (payload.replyTo as string) || (payload["Email"] as string) || "contact@generalesquire.com";
    const attachmentBase64 = (payload._attachment as string) || (payload.attachmentBase64 as string) || undefined;
    const attachmentFilename = (payload._attachmentFilename as string) || (payload.attachmentFilename as string) || "Formulaire_General_Esquire.pdf";

    const fields: Record<string, unknown> = {};
    Object.entries(payload)
      .filter(([k]) => !k.startsWith("_") && !["subject", "replyTo", "attachmentBase64", "attachmentFilename"].includes(k))
      .forEach(([k, v]) => {
        fields[k] = v;
      });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        targetEmail: targetEmail || ADMIN_NOTIFY_EMAIL,
        subject,
        replyTo,
        fields,
        attachmentBase64,
        attachmentFilename,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const resData = await res.json().catch(() => ({}));
    if (res.ok && resData?.success) {
      return { success: true, detail: "Délivré via PHP Mailer LWS (contact@generalesquire.com)" };
    }

    return {
      success: false,
      detail: resData?.message || `HTTP ${res.status} depuis ${endpoint}`,
    };
  } catch (err) {
    return { success: false, detail: String(err) };
  }
}

/**
 * Canal 2 : Envoi direct via API Resend vers le compte administrateur Proton
 * Inclut la pièce jointe PDF
 */
async function sendViaResend(
  payload: Record<string, unknown>
): Promise<{ success: boolean; detail?: string }> {
  try {
    const subject = (payload._subject as string) || (payload.subject as string) || `[General Esquire] Notification - ${new Date().toLocaleDateString("fr-FR")}`;
    const replyTo = (payload._replyto as string) || (payload.replyTo as string) || (payload["Email"] as string) || "contact@generalesquire.com";
    const attachmentBase64 = (payload._attachment as string) || (payload.attachmentBase64 as string) || undefined;

    const fieldsRows = Object.entries(payload)
      .filter(([k]) => !k.startsWith("_") && !["subject", "replyTo", "attachmentBase64", "attachmentFilename"].includes(k))
      .map(
        ([k, v]) =>
          `<tr><td style="padding:10px 14px;border-bottom:1px solid #eee;font-weight:bold;color:#131513;background:#faf8f5;width:35%;">${k}</td><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#333;">${
            typeof v === "object" ? JSON.stringify(v) : String(v)
          }</td></tr>`
      )
      .join("");

    const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;border:1px solid #C5A059;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
        <div style="background-color:#131513;padding:22px;text-align:center;border-bottom:2px solid #C5A059;">
          <h1 style="color:#E9D18F;margin:0;font-size:22px;letter-spacing:3px;">GENERAL ESQUIRE</h1>
          <p style="color:#C5A059;margin:6px 0 0 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Cabinet de Conseil Juridique &amp; Chrysalides</p>
        </div>
        <div style="padding:26px;background-color:#ffffff;">
          <h2 style="color:#131513;font-size:16px;margin-top:0;padding-bottom:12px;border-bottom:1px solid #eee;">${subject}</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:15px;font-size:14px;">
            ${fieldsRows}
          </table>
        </div>
        <div style="background-color:#f8f9fa;padding:14px;text-align:center;font-size:11px;color:#777;border-top:1px solid #eee;">
          © ${new Date().getFullYear()} Cabinet General Esquire - Notification Transactionnelle Sécurisée
        </div>
      </div>
    `;

    const requestBody: Record<string, unknown> = {
      from: "onboarding@resend.dev",
      to: [ADMIN_BACKUP_EMAIL], // Compte de réception direct Proton
      reply_to: replyTo,
      subject: `[Notification General Esquire] ${subject.replace(/^\[General Esquire\]\s*/, "")}`,
      html: htmlContent,
    };

    if (attachmentBase64) {
      const cleanB64 = attachmentBase64
        .replace(/^data:application\/pdf;base64,/, "")
        .replace(/^data:image\/[a-z]+;base64,/, "")
        .replace(/\s+/g, "");

      if (cleanB64) {
        requestBody.attachments = [
          {
            filename: (payload.attachmentFilename as string) || "Formulaire_General_Esquire.pdf",
            content: cleanB64,
          },
        ];
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const resJson = await res.json().catch(() => ({}));
    if (res.ok && resJson?.id) {
      return { success: true, detail: `Délivré via Resend (ID: ${resJson.id})` };
    }

    return {
      success: false,
      detail: resJson?.message || `Statut ${res.status}`,
    };
  } catch (err) {
    return { success: false, detail: String(err) };
  }
}

/**
 * Canal 3 : Edge Function Supabase avec timeout strict
 */
async function sendViaSupabase(
  targetEmail: string,
  payload: Record<string, unknown>
): Promise<{ success: boolean; detail?: string }> {
  try {
    const timeoutPromise = new Promise<{ error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout Supabase (3.5s)")), 3500)
    );

    const invokePromise = supabase.functions.invoke("send-notification", {
      body: { targetEmail, payload },
    });

    const res: any = await Promise.race([invokePromise, timeoutPromise]);
    if (!res.error && res.data?.success) {
      return { success: true, detail: "Délivré via Supabase send-notification" };
    }
    return { success: false, detail: res.error?.message || "Échec fonction Supabase" };
  } catch (err) {
    return { success: false, detail: String(err) };
  }
}

/**
 * Canal 4 : Secours FormSubmit direct navigateur
 */
async function directBrowserFallback(
  targetEmail: string,
  payload: Record<string, unknown>
): Promise<{ success: boolean; detail?: string; needsActivation?: boolean }> {
  try {
    const subject = (payload._subject as string) || (payload.subject as string) || `[General Esquire] Notification - ${new Date().toLocaleDateString("fr-FR")}`;
    const formSubmitPayload: Record<string, unknown> = {
      _subject: subject,
      _template: "table",
      _captcha: "false",
      _replyto: payload._replyto || payload.replyTo || payload["Email"] || targetEmail,
    };

    Object.entries(payload)
      .filter(([k]) => !k.startsWith("_") && !["attachmentBase64", "attachmentFilename"].includes(k))
      .forEach(([k, v]) => {
        formSubmitPayload[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
      });

    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
 * Envoie une notification transactionnelle par email avec garantie multi-canal et pièce jointe PDF
 */
export async function sendEmailNotification(
  targetEmail: string = ADMIN_NOTIFY_EMAIL,
  payload: Record<string, unknown>
): Promise<boolean> {
  const cleanEmail = targetEmail?.trim() || ADMIN_NOTIFY_EMAIL;
  let sent = false;

  // Canal 1 : PHP Mailer natif LWS (contact@generalesquire.com avec PDF)
  const phpRes = await sendViaPhpMailer(cleanEmail, payload);
  if (phpRes.success) {
    sent = true;
  }

  // Canal 2 : API directe Resend (vers Proton avec PDF - garantit la double réception)
  const resendRes = await sendViaResend(payload);
  if (resendRes.success) {
    sent = true;
  }

  if (sent) {
    return true;
  }

  // Canal 3 : Supabase Edge Function si disponible
  const supaRes = await sendViaSupabase(cleanEmail, payload);
  if (supaRes.success) {
    return true;
  }

  // Canal 4 : Secours FormSubmit
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
    _subject: `[TEST SYSTÈME] Diagnostic Réception Email General Esquire - ${new Date().toLocaleTimeString("fr-FR")}`,
    "Type de test": "Diagnostic automatique de distribution multi-canal",
    "Destinataire": cleanEmail,
    "Date & Heure": new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
    "Plateforme": "General Esquire Administration",
    "Message": "Si vous lisez ce message, la distribution d'emails et de PDF vers vos boîtes fonctionne parfaitement.",
  };

  const channels: Array<{ channel: string; success: boolean; detail?: string }> = [];

  // Test Canal 1 (PHP Mailer)
  const phpRes = await sendViaPhpMailer(cleanEmail, testPayload);
  channels.push({ channel: "PHP Mailer LWS (contact@generalesquire.com)", success: phpRes.success, detail: phpRes.detail });

  // Test Canal 2 (Resend Direct)
  const resendRes = await sendViaResend(testPayload);
  channels.push({ channel: "Resend Direct API (generalesquire@proton.me)", success: resendRes.success, detail: resendRes.detail });

  // Test Canal 3 (Supabase)
  const supaRes = await sendViaSupabase(cleanEmail, testPayload);
  channels.push({ channel: "Supabase Edge Function", success: supaRes.success, detail: supaRes.detail });

  const hasSuccess = channels.some((c) => c.success);

  return {
    success: hasSuccess,
    message: hasSuccess ? "Notification de test transmise avec succès." : "Échec des canaux de distribution.",
    channels,
    needsActivation: false,
  };
}