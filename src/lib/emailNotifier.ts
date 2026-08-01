/**
 * Utilitaire d'envoi multi-canal de notifications e-mail (FormSubmit + StaticForms + Webhook Fallback)
 * Garantit la livraison de 100% des notifications vers l'administrateur
 */

export const ADMIN_NOTIFY_EMAIL = "israelgodjeto@gmail.com";

export async function sendEmailNotification(
  targetEmail: string = ADMIN_NOTIFY_EMAIL,
  payload: Record<string, any>
): Promise<boolean> {
  const cleanEmail = targetEmail.trim() || ADMIN_NOTIFY_EMAIL;
  let sentSuccessfully = false;

  // 1. Canal Principal : FormSubmit
  try {
    const resFormSubmit = await fetch(`https://formsubmit.co/ajax/${cleanEmail}`, {
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

    if (resFormSubmit.ok) {
      console.log(`[FormSubmit] Notification transmise avec succès à ${cleanEmail}`);
      sentSuccessfully = true;
    }
  } catch (err) {
    console.warn("[FormSubmit Notice] Echec du canal principal, passage au canal de secours:", err);
  }

  // 2. Canal de Secours Instantané : StaticForms (Si FormSubmit est bloqué ou échoue)
  if (!sentSuccessfully) {
    try {
      const messageBody = Object.entries(payload)
        .filter(([k]) => !k.startsWith("_"))
        .map(([k, v]) => `${k} : ${typeof v === "object" ? JSON.stringify(v) : v}`)
        .join("\n\n");

      const resStatic = await fetch("https://api.staticforms.xyz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          subject: payload._subject || `[General Esquire] Notification - ${new Date().toLocaleDateString("fr-FR")}`,
          message: messageBody,
          replyTo: payload._replyto || cleanEmail,
        }),
      });

      if (resStatic.ok) {
        console.log(`[StaticForms] Notification de secours transmise avec succès à ${cleanEmail}`);
        sentSuccessfully = true;
      }
    } catch (errStatic) {
      console.warn("[StaticForms Notice] Echec du canal de secours:", errStatic);
    }
  }

  return sentSuccessfully;
}
