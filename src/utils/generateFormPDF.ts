import { jsPDF } from "jspdf";

export interface FormPDFData {
  title: string;
  reference?: string;
  fields: Array<{ label: string; value: string }>;
  clientEmail?: string;
  dateStr?: string;
  images?: string[]; // Photos et pièces jointes annexées au formulaire
}

/**
 * Génère et télécharge un PDF officiel haut de gamme pour toute soumission de formulaire General Esquire
 */
export function generateFormPDF(data: FormPDFData): void {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const primaryGold = "#C5A059";
    const darkBg = "#131513";
    const textDark = "#1c1c1c";
    const textGray = "#555555";

    // 1. Bande de titre supérieure (En-tête cabinet)
    doc.setFillColor(19, 21, 19); // #131513
    doc.rect(0, 0, 210, 38, "F");

    // Bordure dorée décorative
    doc.setDrawColor(197, 160, 89); // #C5A059
    doc.setLineWidth(1);
    doc.line(0, 38, 210, 38);

    // Titre Cabinet
    doc.setTextColor(233, 209, 143); // #E9D18F
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("GENERAL ESQUIRE", 15, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(197, 160, 89);
    doc.text("Cabinet de Conseil Juridique & Espace Activités Chrysalides", 15, 23);

    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text("61 rue de Lyon, 75012 PARIS  |  contact@generalesquire.com", 15, 30);

    // Badge Destinataire à droite
    doc.setFillColor(30, 30, 30);
    doc.roundedRect(125, 10, 70, 20, 2, 2, "F");
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.3);
    doc.roundedRect(125, 10, 70, 20, 2, 2, "D");

    doc.setFontSize(7);
    doc.setTextColor(197, 160, 89);
    doc.text("DESTINATAIRE ADMINISTRATIF", 129, 16);
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("generalesquire@proton.me", 129, 24);

    // 2. Titre du Formulaire
    doc.setTextColor(28, 28, 28);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(data.title.toUpperCase(), 15, 52);

    // Ligne séparatrice sous le titre
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.5);
    doc.line(15, 56, 195, 56);

    // Informations Méta (Réf & Date)
    const refText = data.reference || `REF-ESQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateText = data.dateStr || new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Référence soumission : ${refText}`, 15, 63);
    doc.text(`Date & Heure : ${dateText}`, 195, 63, { align: "right" });

    // 3. Tableau des données du Formulaire
    let currentY = 74;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(197, 160, 89);
    doc.setFillColor(248, 245, 238); // Beige très clair
    doc.rect(15, currentY - 5, 180, 8, "F");
    doc.text("INFORMATIONS DU FORMULAIRE SOUMIS", 18, currentY);
    currentY += 8;

    data.fields.forEach((field, index) => {
      // Alternance de couleur de fond de ligne
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(15, currentY - 4, 180, 10, "F");
      } else {
        doc.setFillColor(245, 245, 245);
        doc.rect(15, currentY - 4, 180, 10, "F");
      }

      // Libellé (gauche)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(field.label, 18, currentY + 2);

      // Valeur (droite)
      doc.setFont("helvetica", "normal");
      doc.setTextColor(20, 20, 20);

      // Gestion multi-lignes si le message est long
      const splitValue = doc.splitTextToSize(field.value || "Non renseigné", 110);
      doc.text(splitValue, 80, currentY + 2);

      const addedHeight = Math.max(10, splitValue.length * 5 + 4);
      currentY += addedHeight;

      // Saut de page automatique si on dépasse le bas de page
      if (currentY > 260) {
        doc.addPage();
        currentY = 25;
      }
    });

    // 3.5. Intégration des photos & pièces jointes dans le PDF
    if (data.images && data.images.length > 0) {
      doc.addPage();
      let imgY = 20;

      doc.setFillColor(19, 21, 19);
      doc.rect(0, 0, 210, 25, "F");
      doc.setTextColor(233, 209, 143);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("ANNEXES PHOTOGRAPHIQUES & PIÈCES JOINTES", 15, 16);

      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.5);
      doc.line(0, 25, 210, 25);

      imgY = 32;

      data.images.forEach((imgData, idx) => {
        if (!imgData) return;
        try {
          if (imgY > 210) {
            doc.addPage();
            imgY = 25;
          }

          doc.setFontSize(9);
          doc.setTextColor(197, 160, 89);
          doc.setFont("helvetica", "bold");
          doc.text(`Photo / Pièce Jointe N°${idx + 1}`, 15, imgY);
          imgY += 4;

          const format = imgData.includes("data:image/png") ? "PNG" : "JPEG";
          doc.addImage(imgData, format, 15, imgY, 130, 85);
          imgY += 95;
        } catch (imgErr) {
          console.warn(`Intégration photo ${idx + 1} échouée:`, imgErr);
        }
      });
    }

    // 4. Cadre d'Authentification / Validation
    currentY = Math.max(currentY + 10, 230);

    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, currentY, 180, 32, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(197, 160, 89);
    doc.text("ENGAGEMENT & CONFORMITÉ - GENERAL ESQUIRE", 20, currentY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(90, 90, 90);
    const legalNotice =
      "Document officiel généré automatiquement suite à la soumission sur le site generalesquire.com.\nTransmis en copie conforme et sécurisée à l'administration du cabinet (generalesquire@proton.me).\nCe document fait foi de réception initiale sous réserve de validation définitive par la direction.";
    doc.text(doc.splitTextToSize(legalNotice, 170), 20, currentY + 13);

    // 5. Pied de page
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "© 2026 GENERAL ESQUIRE — Tous droits réservés — Document généré au format PDF officiel",
      105,
      287,
      { align: "center" }
    );

    // Téléchargement automatique du fichier PDF
    const filename = `${data.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${refText}.pdf`;
    doc.save(filename);
  } catch (err) {
    console.error("Erreur lors de la génération du PDF du formulaire:", err);
  }
}

/**
 * Génère et renvoie le PDF officiel sous forme de chaîne Base64 (Data URI)
 * pour l'envoi automatique direct par email à generalesquire@proton.me
 */
export function getFormPDFBase64(data: FormPDFData): string {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 1. En-tête cabinet
    doc.setFillColor(19, 21, 19);
    doc.rect(0, 0, 210, 38, "F");

    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(1);
    doc.line(0, 38, 210, 38);

    doc.setTextColor(233, 209, 143);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("GENERAL ESQUIRE", 15, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(197, 160, 89);
    doc.text("Cabinet de Conseil Juridique & Espace Activités Chrysalides", 15, 23);

    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text("61 rue de Lyon, 75012 PARIS  |  contact@generalesquire.com", 15, 30);

    // Destinataire
    doc.setFillColor(30, 30, 30);
    doc.roundedRect(125, 10, 70, 20, 2, 2, "F");
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.3);
    doc.roundedRect(125, 10, 70, 20, 2, 2, "D");

    doc.setFontSize(7);
    doc.setTextColor(197, 160, 89);
    doc.text("DESTINATAIRE ADMINISTRATIF", 129, 16);
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("generalesquire@proton.me", 129, 24);

    // 2. Titre du Formulaire
    doc.setTextColor(28, 28, 28);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(data.title.toUpperCase(), 15, 52);

    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.5);
    doc.line(15, 56, 195, 56);

    const refText = data.reference || `REF-ESQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateText = data.dateStr || new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Référence soumission : ${refText}`, 15, 63);
    doc.text(`Date & Heure : ${dateText}`, 195, 63, { align: "right" });

    // 3. Tableau des données
    let currentY = 74;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(197, 160, 89);
    doc.setFillColor(248, 245, 238);
    doc.rect(15, currentY - 5, 180, 8, "F");
    doc.text("INFORMATIONS DU FORMULAIRE SOUMIS", 18, currentY);
    currentY += 8;

    data.fields.forEach((field, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(15, currentY - 4, 180, 10, "F");
      } else {
        doc.setFillColor(245, 245, 245);
        doc.rect(15, currentY - 4, 180, 10, "F");
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(field.label, 18, currentY + 2);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(20, 20, 20);

      const splitValue = doc.splitTextToSize(field.value || "Non renseigné", 110);
      doc.text(splitValue, 80, currentY + 2);

      const addedHeight = Math.max(10, splitValue.length * 5 + 4);
      currentY += addedHeight;

      if (currentY > 260) {
        doc.addPage();
        currentY = 25;
      }
    });

    // Intégration des photos & pièces jointes dans le PDF Base64
    if (data.images && data.images.length > 0) {
      doc.addPage();
      let imgY = 20;

      doc.setFillColor(19, 21, 19);
      doc.rect(0, 0, 210, 25, "F");
      doc.setTextColor(233, 209, 143);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("ANNEXES PHOTOGRAPHIQUES & PIÈCES JOINTES", 15, 16);

      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.5);
      doc.line(0, 25, 210, 25);

      imgY = 32;

      data.images.forEach((imgData, idx) => {
        if (!imgData) return;
        try {
          if (imgY > 210) {
            doc.addPage();
            imgY = 25;
          }

          doc.setFontSize(9);
          doc.setTextColor(197, 160, 89);
          doc.setFont("helvetica", "bold");
          doc.text(`Photo / Pièce Jointe N°${idx + 1}`, 15, imgY);
          imgY += 4;

          const format = imgData.includes("data:image/png") ? "PNG" : "JPEG";
          doc.addImage(imgData, format, 15, imgY, 130, 85);
          imgY += 95;
        } catch (imgErr) {
          console.warn(`Intégration photo ${idx + 1} Base64 échouée:`, imgErr);
        }
      });
    }

    // Cadre d'Authentification
    currentY = Math.max(currentY + 10, 230);

    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, currentY, 180, 32, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(197, 160, 89);
    doc.text("ENGAGEMENT & CONFORMITÉ - GENERAL ESQUIRE", 20, currentY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(90, 90, 90);
    const legalNotice =
      "Document officiel généré automatiquement suite à la soumission sur le site generalesquire.com.\nTransmis en copie conforme et sécurisée à l'administration du cabinet (generalesquire@proton.me).\nCe document fait foi de réception initiale sous réserve de validation définitive par la direction.";
    doc.text(doc.splitTextToSize(legalNotice, 170), 20, currentY + 13);

    // Pied de page
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "© 2026 GENERAL ESQUIRE — Tous droits réservés — Document généré au format PDF officiel",
      105,
      287,
      { align: "center" }
    );

    return doc.output("datauristring");
  } catch (err) {
    console.error("Erreur lors de la génération Base64 du PDF:", err);
    return "";
  }
}

/**
 * Charge le logo en base64 depuis le dossier public
 */
async function loadLogoBase64(): Promise<string | null> {
  try {
    const response = await fetch("/images/Faviconofficielle1.jpg");
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Génère et télécharge le RIB officiel de General Esquire au format PDF
 */
export async function generateRIB_PDF(): Promise<void> {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Chargement du logo
    const logoB64 = await loadLogoBase64();

    // ——— EN-TÊTE ———
    doc.setFillColor(19, 21, 19);
    doc.rect(0, 0, 210, 44, "F");

    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(1);
    doc.line(0, 44, 210, 44);

    // Logo de l'entreprise (coin gauche de l'en-tête)
    if (logoB64) {
      try {
        doc.addImage(logoB64, "JPEG", 12, 5, 24, 24);
      } catch {
        // Logo non disponible, on continue sans
      }
    }

    // Texte en-tête (décalé à droite du logo)
    doc.setTextColor(233, 209, 143);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("GENERAL ESQUIRE", 42, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(197, 160, 89);
    doc.text("Relevé d'Identité Bancaire (RIB / IBAN Officielles)", 42, 24);

    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text("61 rue de Lyon, 75012 PARIS  |  contact@generalesquire.com", 42, 32);

    // ——— TITRE DOCUMENT ———
    doc.setTextColor(28, 28, 28);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("COORDONNÉES BANCAIRES OFFICIELLES", 15, 58);

    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.5);
    doc.line(15, 62, 195, 62);

    // ——— CADRE COORDONNÉES BANCAIRES ———
    doc.setFillColor(250, 248, 242);
    doc.setDrawColor(197, 160, 89);
    doc.roundedRect(15, 70, 180, 80, 3, 3, "FD");

    const addRow = (label: string, value: string, y: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(197, 160, 89);
      doc.text(label, 22, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 20);
      doc.text(value, 90, y);
    };

    addRow("TITULAIRE DU COMPTE :", "GENERAL ESQUIRE", 84);
    addRow("NUMÉRO IBAN :", "FR76 1741 8000 0100 0120 9487 411", 100);
    addRow("CODE BIC / SWIFT :", "SHNNFR22XXX", 116);
    addRow("BANQUE PARTENAIRE :", "SHINE", 132);

    // ——— PIED DE PAGE ———
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "© 2026 GENERAL ESQUIRE — Cabinet de Conseil Juridique — 61 rue de Lyon 75012 PARIS",
      105,
      285,
      { align: "center" }
    );

    doc.save("RIB_GENERAL_ESQUIRE.pdf");
  } catch (err) {
    console.error("Erreur lors de la génération du RIB PDF:", err);
  }
}

