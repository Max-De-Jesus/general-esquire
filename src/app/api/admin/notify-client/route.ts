import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientEmail, clientName, action, reason, adminEmail } = body;

    if (!clientEmail || !action) {
      return NextResponse.json({ success: false, error: "clientEmail et action requis" }, { status: 400 });
    }

    let subject = "";
    let messageBody = "";

    if (action === "Accepté") {
      subject = `[General Esquire] Félicitations, votre compte a été validé !`;
      messageBody =
        `Bonjour ${clientName || "Cher Client"},\n\n` +
        `Nous avons le plaisir de vous informer que votre compte a été officiellement validé par l'administration de General Esquire.\n\n` +
        `Vous pouvez désormais accéder à l'ensemble de la plateforme et vous rendre sur notre espace sécurisé de paiement afin de finaliser votre inscription et votre règlement :\n` +
        `https://www.generalesquire.com/paiement\n\n` +
        `Pour toute question, notre équipe reste à votre entière disposition à l'adresse contact@generalesquire.com ou au +33 (0)1 59 58 17 25.\n\n` +
        `Cordialement,\n` +
        `L'Administration General Esquire\n` +
        `61 rue de Lyon, 75012 PARIS`;
    } else if (action === "Refusé") {
      subject = `[General Esquire] Décision concernant votre demande d'inscription`;
      messageBody =
        `Bonjour ${clientName || "Cher Client"},\n\n` +
        `Nous vous remercions de l'intérêt porté au Cabinet General Esquire.\n\n` +
        `Après étude de votre dossier, nous vous informons que votre demande d'inscription n'a pas pu être retenue par notre administration.\n\n` +
        (reason ? `Motif de la décision :\n${reason}\n\n` : "") +
        `Pour toute précision ou contestation, vous pouvez contacter nos services par email à contact@generalesquire.com.\n\n` +
        `Cordialement,\n` +
        `L'Administration General Esquire`;
    } else {
      subject = `[General Esquire] Votre demande d'inscription est en cours d'examen`;
      messageBody =
        `Bonjour ${clientName || "Cher Client"},\n\n` +
        `Nous vous informons que votre compte est actuellement en cours d'examen par les services administratifs de General Esquire.\n\n` +
        `Une notification automatique vous sera adressée par email dès qu'une décision définitive sera arrêtée.\n\n` +
        `Cordialement,\n` +
        `L'Administration General Esquire`;
    }

    const emailPayload: Record<string, string> = {
      _subject: subject,
      _replyto: adminEmail || "contact@generalesquire.com",
      _template: "table",
      _captcha: "false",
      "Destinataire": clientName ? `${clientName} (${clientEmail})` : clientEmail,
      "Statut attribué": action,
      "Objet": subject,
      "Message transmis": messageBody,
      "Administrateur": adminEmail || "generalesquire@proton.me",
      "Date": new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
    };

    // Forward to FormSubmit to send email to client's email address
    const response = await fetch(`https://formsubmit.co/ajax/${clientEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: `Notification par email transmise avec succès à ${clientEmail}` });
    } else {
      console.warn("FormSubmit client notification status:", response.status);
      return NextResponse.json({ success: true, warning: "Email client mis en file d'attente" });
    }
  } catch (error: any) {
    console.error("API Admin Notify Client Route Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Erreur d'envoi notification" }, { status: 500 });
  }
}
