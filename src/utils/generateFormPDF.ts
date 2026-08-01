import { jsPDF } from "jspdf";

export interface FormPDFData {
  title: string;
  reference?: string;
  fields: Array<{ label: string; value: string }>;
  clientEmail?: string;
  dateStr?: string;
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
