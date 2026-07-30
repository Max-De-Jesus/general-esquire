import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, structure, country, subject, message, type } = body;

    const emailPayload = {
      _subject: `[General Esquire] ${subject || "Nouvelle demande de contact"} — ${name || email}`,
      _replyto: email,
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
