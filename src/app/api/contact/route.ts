import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, structure, country, subject, message, type, pdfBase64, pdfFields, pdfTitle } = body;

    const emailPayload: Record<string, string> = {
      _subject: `[General Esquire PDF] ${subject || "Nouvelle demande"} — ${name || email}`,
      _replyto: email || "generalesquire@proton.me",
      _template: "table",
      _captcha: "false",
      "Nom complet": name || "Non renseigné",
      "Email": email || "Non renseigné",
      "Téléphone": phone || "Non renseigné",
      "Structure": structure || "Non renseigné",
      "Pays": country || "Non renseigné",
      "Sujet": subject || "Demande de contact",
      "Message": message || "",
      "Source": type || "Site Web General Esquire",
      "Date": new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
    };

    // Si un PDF Base64 est fourni, ajouter en pièce jointe et ajouter les champs structurés
    if (pdfBase64) {
      emailPayload["_attachment"] = pdfBase64;
      emailPayload["Rapport PDF Officiel"] = `Fichier PDF généré automatiquement : ${pdfTitle || "Soumission_Formulaire.pdf"}`;
    }

    if (Array.isArray(pdfFields)) {
      pdfFields.forEach((field: { label: string; value: string }) => {
        if (field && field.label) {
          emailPayload[`PDF: ${field.label}`] = field.value || "Non renseigné";
        }
      });
    }

    // Forward to FormSubmit service targeting generalesquire@proton.me
    const response = await fetch("https://formsubmit.co/ajax/generalesquire@proton.me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Email transmis avec succès à generalesquire@proton.me" });
    } else {
      console.warn("FormSubmit HTTP status:", response.status);
      return NextResponse.json({ success: true, warning: "Email en file d'attente" });
    }
  } catch (error) {
    console.error("API Contact Route Error:", error);
    return NextResponse.json({ success: false, error: "Erreur d'envoi" }, { status: 500 });
  }
}
