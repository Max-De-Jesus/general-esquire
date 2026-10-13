import { jsonHeaders, corsHeaders } from "../_shared/cors.ts";
import { isAdminEmail, requireAdmin } from "../_shared/admin.ts";

const ADMIN_NOTIFY_EMAIL = "generalesquire@proton.me";

// Les champs du formulaire viennent du navigateur : ils sont échappés avant
// d'être insérés dans le HTML de l'email (sinon injection de liens / HTML).
function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: jsonHeaders });
  }

  try {
    const body = await req.json();
    const targetEmail: string = String(body.targetEmail || ADMIN_NOTIFY_EMAIL).trim() || ADMIN_NOTIFY_EMAIL;
    const payload: Record<string, unknown> = body.payload || {};

    // Anti-relais ouvert : sans session administrateur, seules les boîtes du
    // cabinet peuvent être destinataires. Les emails aux clients (décisions
    // de l'administration) exigent un JWT administrateur.
    if (!isAdminEmail(targetEmail)) {
      const admin = await requireAdmin(req);
      if (!admin) {
        return new Response(
          JSON.stringify({ success: false, error: "Destinataire non autorisé." }),
          { status: 403, headers: jsonHeaders }
        );
      }
    }
    let sentSuccessfully = false;
    const channelsTried: Array<{ channel: string; success: boolean; detail?: string }> = [];

    const subject =
      (payload._subject as string) || `[General Esquire] Notification - ${new Date().toLocaleDateString("fr-FR")}`;

    // ── Canal 1 : Resend API (si clé configurée, le canal transactionnel le plus fiable) ──
    const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
    if (resendApiKey) {
      try {
        const fieldsHtml = Object.entries(payload)
          .filter(([k]) => !k.startsWith("_"))
          .map(
            ([k, v]) =>
              `<tr><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;color:#131513;width:35%;">${escapeHtml(k)}</td><td style="padding:10px;border-bottom:1px solid #eee;color:#444;">${
                escapeHtml(typeof v === "object" ? JSON.stringify(v) : v)
              }</td></tr>`
          )
          .join("");

        const htmlContent = `
          <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;border:1px solid #C5A059;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
            <div style="background-color:#131513;padding:24px;text-align:center;border-bottom:2px solid #C5A059;">
              <h1 style="color:#E9D18F;margin:0;font-size:22px;letter-spacing:3px;">GENERAL ESQUIRE</h1>
              <p style="color:#C5A059;margin:6px 0 0 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Cabinet de Conseil Juridique &amp; Chrysalides</p>
            </div>
            <div style="padding:28px;background-color:#ffffff;">
              <h2 style="color:#131513;font-size:16px;margin-top:0;padding-bottom:12px;border-bottom:1px solid #eee;">${escapeHtml(subject)}</h2>
              <table style="width:100%;border-collapse:collapse;margin-top:15px;font-size:14px;">
                ${fieldsHtml}
              </table>
            </div>
            <div style="background-color:#f8f9fa;padding:16px;text-align:center;font-size:11px;color:#777;border-top:1px solid #eee;">
              © 2026 Cabinet General Esquire — Notification Automatique Transactionnelle Sécurisée
            </div>
          </div>
        `;

        let resendAttachments: Array<{ filename: string; content: string }> | undefined;
        if (typeof payload._attachment === "string") {
          const rawBase64 = (payload._attachment as string)
            .replace(/^data:application\/pdf;base64,/, "")
            .replace(/^data:image\/[a-z]+;base64,/, "")
            .trim();
          if (rawBase64) {
            resendAttachments = [{ filename: "Formulaire_General_Esquire.pdf", content: rawBase64 }];
          }
        }

        const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "onboarding@resend.dev";
        const resendRequestBody: Record<string, unknown> = {
          from: fromEmail,
          to: [targetEmail],
          subject: `[Notification General Esquire] ${subject.replace(/^\[General Esquire\]\s*/, "")}`,
          html: htmlContent,
        };
        if (resendAttachments) resendRequestBody.attachments = resendAttachments;

        const resResend = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify(resendRequestBody),
        });

        const resendJson = await resResend.json().catch(() => ({}));
        if (resResend.ok && resendJson?.id) {
          sentSuccessfully = true;
          channelsTried.push({ channel: "Resend", success: true, detail: `ID: ${resendJson.id}` });
        } else {
          channelsTried.push({
            channel: "Resend",
            success: false,
            detail: resendJson?.message || JSON.stringify(resendJson),
          });
          console.warn("[Resend API] échec canal #1:", resendJson);
        }
      } catch (errResend) {
        channelsTried.push({ channel: "Resend", success: false, detail: String(errResend) });
        console.warn("[Resend API] exception canal #1:", errResend);
      }
    }

    // ── Canal 2 : FormSubmit (avec parsing strict et headers web requis) ──
    if (!sentSuccessfully) {
      try {
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

        const resFormSubmit = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://generalesquire.com",
            "Referer": "https://generalesquire.com/",
          },
          body: JSON.stringify(formSubmitPayload),
        });

        const formSubmitData = await resFormSubmit.json().catch(() => ({}));
        const isSuccess =
          resFormSubmit.ok &&
          (formSubmitData?.success === "true" ||
            formSubmitData?.success === true ||
            (formSubmitData?.message && String(formSubmitData.message).toLowerCase().includes("sent")));

        if (isSuccess) {
          sentSuccessfully = true;
          channelsTried.push({ channel: "FormSubmit", success: true });
        } else {
          const errMsg = formSubmitData?.message || `Statut HTTP ${resFormSubmit.status}`;
          channelsTried.push({ channel: "FormSubmit", success: false, detail: errMsg });
          console.warn("[FormSubmit] réponse rejetée:", formSubmitData);
        }
      } catch (err) {
        channelsTried.push({ channel: "FormSubmit", success: false, detail: String(err) });
        console.warn("[FormSubmit] échec canal #2:", err);
      }
    }

    // ── Canal 3 : Web3Forms (secours multi-canal) ──
    if (!sentSuccessfully) {
      const web3Key = Deno.env.get("WEB3FORMS_ACCESS_KEY") ?? "";
      if (web3Key) {
        try {
          const messageBody = Object.entries(payload)
            .filter(([k]) => !k.startsWith("_"))
            .map(([k, v]) => `${k} : ${typeof v === "object" ? JSON.stringify(v) : v}`)
            .join("\n\n");

          const resWeb3 = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: web3Key,
              subject,
              from_name: "General Esquire - Notification",
              message: messageBody,
              email: targetEmail,
            }),
          });
          const web3Json = await resWeb3.json().catch(() => ({}));
          if (resWeb3.ok && (web3Json?.success === true || web3Json?.success === "true")) {
            sentSuccessfully = true;
            channelsTried.push({ channel: "Web3Forms", success: true });
          } else {
            channelsTried.push({
              channel: "Web3Forms",
              success: false,
              detail: web3Json?.message || JSON.stringify(web3Json),
            });
          }
        } catch (errWeb3) {
          channelsTried.push({ channel: "Web3Forms", success: false, detail: String(errWeb3) });
          console.warn("[Web3Forms] échec canal #3:", errWeb3);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: sentSuccessfully,
        targetEmail,
        channels: channelsTried,
        message: sentSuccessfully
          ? "Notification transmise avec succès."
          : "Aucun canal n'a pu délivrer le message (vérifiez l'activation FormSubmit ou les clés de service).",
      }),
      { headers: jsonHeaders }
    );
  } catch (err) {
    console.error("send-notification error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Erreur interne lors de l'envoi de la notification." }),
      {
        status: 500,
        headers: jsonHeaders,
      }
    );
  }
});
