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

/**
 * Génère et télécharge le RIB officiel de General Esquire au format PDF
 */
export function generateRIB_PDF(): void {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // En-tête Cabinet
    doc.setFillColor(19, 21, 19);
    doc.rect(0, 0, 210, 40, "F");

    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(1);
    doc.line(0, 40, 210, 40);

    doc.setTextColor(233, 209, 143);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("GENERAL ESQUIRE", 15, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(197, 160, 89);
    doc.text("Relevé d'Identité Bancaire (RIB / IBAN Officielles)", 15, 24);

    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text("61 rue de Lyon, 75012 PARIS  |  contact@generalesquire.com", 15, 32);

    // Titre Document
    doc.setTextColor(28, 28, 28);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("COORDONNÉES BANCAIRES OFFICIELLES (RECOMMANDÉ POUR GRÉ À GRÉ)", 15, 55);

    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.5);
    doc.line(15, 59, 195, 59);

    // Cadre Coordonnées
    doc.setFillColor(250, 248, 242);
    doc.setDrawColor(197, 160, 89);
    doc.roundedRect(15, 68, 180, 75, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(197, 160, 89);
    doc.text("TITULAIRE DU COMPTE :", 22, 80);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);
    doc.text("GENERAL ESQUIRE SAS", 80, 80);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(197, 160, 89);
    doc.text("NUMÉRO IBAN :", 22, 95);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text("FR76 1741 8000 0100 0120 9...", 80, 95);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(197, 160, 89);
    doc.text("CODE BIC / SWIFT :", 22, 110);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);
    doc.text("SNNNFR22XXX", 80, 110);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(197, 160, 89);
    doc.text("BANQUE PARTENAIRE :", 22, 125);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);
    doc.text("Banque Européenne Partenaire - Réseau SWIFT", 80, 125);

    // Instructions de virement
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(28, 28, 28);
    doc.text("INSTRUCTIONS POUR LE VIREMENT COMPTE À COMPTE", 15, 158);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    const instructions =
      "• Indiquez impérativement votre nom et votre numéro de référence client ou devis dans le motif de votre virement.\n" +
      "• Pour les facturations de gré à gré et partenariats institutionnels, ce RIB officiel garantit la bonne réception directe des fonds.\n" +
      "• Une fois le virement émis, un reçu temporaire vous sera délivré par mail (generalesquire@proton.me).";
    doc.text(doc.splitTextToSize(instructions, 180), 15, 166);

    // Pied de page
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

