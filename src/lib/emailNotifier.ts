/**
 * Utilitaire d'envoi direct de notifications e-mail via FormSubmit.co
 * Fonctionne à 100% sur les hébergements statiques (LWS, Vercel, etc.)
 */

export const ADMIN_NOTIFY_EMAIL = "israelgodjeto@gmail.com";

export async function sendEmailNotification(
  targetEmail: string = ADMIN_NOTIFY_EMAIL,
  payload: Record<string, any>
): Promise<boolean> {
  try {
    const cleanEmail = targetEmail.trim() || ADMIN_NOTIFY_EMAIL;
    const res = await fetch(`https://formsubmit.co/ajax/${cleanEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        _template: "table",
        _captcha: "false",
        ...payload,
      }),
    });

    if (res.ok) {
      console.log(`Notification e-mail transmise avec succès à ${cleanEmail}`);
      return true;
    } else {
      console.warn(`FormSubmit status notice for ${cleanEmail}:`, res.status);
      return false;
    }
  } catch (err) {
    console.warn("Direct FormSubmit email dispatch notice:", err);
    return false;
  }
}
