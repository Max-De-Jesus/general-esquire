import { jsPDF } from "jspdf";

export interface FormPDFData {
  title: string;
  reference?: string;
  fields: Array<{ label: string; value: string }>;
  clientEmail?: string;
  dateStr?: string;
  images?: string[]; // Photos et pièces jointes annexées au formulaire
}

interface BothLogos {
  logo1: string | null; // Faviconofficielle1-circle.png
  logo2: string | null; // logo.png
}

/**
 * Charge les deux logos officiels de l'entreprise en base64
 */
async function loadBothLogosBase64(): Promise<BothLogos> {
  const fetchB64 = async (path: string): Promise<string | null> => {
    try {
      const response = await fetch(path);
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
  };

  const [logo1, logo2] = await Promise.all([
    fetchB64("/images/Faviconofficielle1-circle.png"),
    fetchB64("/images/logo.png"),
  ]);

  return { logo1, logo2 };
}

/**
 * Construit l'objet jsPDF officiel du formulaire (utilisé pour téléchargement client et pièce jointe email)
 */
async function buildFormPDFDoc(data: FormPDFData): Promise<{ doc: jsPDF; filename: string }> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const { logo1, logo2 } = await loadBothLogosBase64();

  // 1. Bande de titre supérieure (En-tête cabinet)
  doc.setFillColor(19, 21, 19);
  doc.rect(0, 0, 210, 44, "F");

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(1);
  doc.line(0, 44, 210, 44);

  // Logo 1 (Faviconofficielle1-circle.png) à gauche
  if (logo1) {
    try {
      doc.addImage(logo1, "PNG", 10, 7, 26, 26);
    } catch {
      // Ignorer si échec
    }
  }

  // Titre & Coordonnées Cabinet (Milieu)
  doc.setTextColor(233, 209, 143);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("GENERAL ESQUIRE", 40, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(197, 160, 89);
  doc.text("Cabinet de Conseil Juridique & Espace Activités Chrysalides", 40, 24);

  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text("61 rue de Lyon, 75012 PARIS  |  contact@generalesquire.com", 40, 32);

  // Badge Destinataire Officiel à droite
  doc.setFillColor(30, 30, 30);
  doc.roundedRect(124, 11, 48, 22, 2, 2, "F");
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.3);
  doc.roundedRect(124, 11, 48, 22, 2, 2, "D");

  doc.setFontSize(6);
  doc.setTextColor(197, 160, 89);
  doc.text("DESTINATAIRE OFFICIEL", 127, 17);
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("contact@generalesquire.com", 127, 25);

  // Logo 2 (logo.png) à l'extrême droite
  if (logo2) {
    try {
      doc.addImage(logo2, "PNG", 176, 7, 26, 26);
    } catch {
      // Ignorer si échec
    }
  }

  // 2. Titre du Formulaire
  doc.setTextColor(28, 28, 28);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(data.title.toUpperCase(), 15, 56);

  // Ligne séparatrice sous le titre
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.5);
  doc.line(15, 60, 195, 60);

  // Informations Méta (Réf & Date)
  const refText = data.reference || `REF-ESQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateText = data.dateStr || new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Référence dossier : ${refText}`, 15, 67);
  doc.text(`Date & Heure : ${dateText}`, 195, 67, { align: "right" });

  // 3. Tableau des données du Formulaire
  let currentY = 78;

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

  // 3.5. Annexes photos / pièces jointes
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

  // 4. Cadre d'Authentification
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
    "Document officiel généré automatiquement suite à la soumission sur le site generalesquire.com.\nTransmis en copie conforme et sécurisée à l'administration du cabinet (contact@generalesquire.com).\nCe document fait foi de réception initiale sous réserve de validation définitive par la direction.";
  doc.text(doc.splitTextToSize(legalNotice, 170), 20, currentY + 13);

  // 5. Pied de page
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "© 2026 GENERAL ESQUIRE - Tous droits réservés - Document généré au format PDF",
    105,
    287,
    { align: "center" }
  );

  const filename = `${data.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${refText}.pdf`;
  return { doc, filename };
}

/**
 * Génère et télécharge le PDF du formulaire pour le client
 */
export async function generateFormPDF(data: FormPDFData): Promise<void> {
  try {
    const { doc, filename } = await buildFormPDFDoc(data);
    doc.save(filename);
  } catch (err) {
    console.error("Erreur lors du téléchargement du PDF du formulaire:", err);
  }
}

/**
 * Génère et renvoie le PDF sous forme de chaîne Base64 (Data URI)
 */
export async function getFormPDFBase64(data: FormPDFData): Promise<string> {
  try {
    const { doc } = await buildFormPDFDoc(data);
    return doc.output("datauristring");
  } catch (err) {
    console.error("Erreur lors de la génération Base64 du PDF:", err);
    return "";
  }
}

/**
 * Génère le PDF, déclenche immédiatement le téléchargement machine pour le client,
 * et renvoie simultanément la chaîne base64 et le nom de fichier pour l'envoi admin
 */
export async function generateAndDownloadFormPDF(
  data: FormPDFData
): Promise<{ base64: string; filename: string }> {
  try {
    const { doc, filename } = await buildFormPDFDoc(data);
    // Téléchargement machine immédiat pour le client
    try {
      doc.save(filename);
    } catch (saveErr) {
      console.warn("Échec déclenchement automatique doc.save:", saveErr);
    }
    const base64 = doc.output("datauristring");
    return { base64, filename };
  } catch (err) {
    console.error("Erreur génération combinée PDF:", err);
    return { base64: "", filename: "Formulaire_General_Esquire.pdf" };
  }
}

/**
 * Génère et télécharge le RIB de General Esquire au format PDF
 */
export async function generateRIB_PDF(): Promise<void> {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const { logo1, logo2 } = await loadBothLogosBase64();

    // --- EN-TÊTE ---
    doc.setFillColor(19, 21, 19);
    doc.rect(0, 0, 210, 40, "F");

    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(1);
    doc.line(0, 40, 210, 40);

    if (logo1) {
      try {
        doc.addImage(logo1, "PNG", 12, 6, 26, 26);
      } catch {}
    }

    doc.setTextColor(233, 209, 143);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("GENERAL ESQUIRE", 42, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(197, 160, 89);
    doc.text("Cabinet de Conseil Juridique & Espace Activités Chrysalides", 42, 23);

    doc.setFontSize(7.5);
    doc.setTextColor(180, 180, 180);
    doc.text("61 rue de Lyon, 75012 PARIS | contact@generalesquire.com", 42, 30);

    if (logo2) {
      try {
        doc.addImage(logo2, "PNG", 175, 6, 26, 26);
      } catch {}
    }

    // --- TITRE DOCUMENT ---
    doc.setTextColor(19, 21, 19);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("RELEVÉ D'IDENTITÉ BANCAIRE & COORDONNÉES SEPA", 15, 52);

    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.6);
    doc.line(15, 56, 195, 56);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 90, 90);
    doc.text("Document officiel réservé aux règlements par virement bancaire SEPA et international.", 15, 62);

    // --- CADRE TITULAIRE DU COMPTE ---
    doc.setFillColor(248, 245, 238);
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.4);
    doc.roundedRect(15, 68, 180, 28, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(197, 160, 89);
    doc.text("TITULAIRE DU COMPTE BÉNÉFICIAIRE", 20, 75);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(19, 21, 19);
    doc.text("GENERAL ESQUIRE", 20, 83);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    doc.text("61 rue de Lyon, 75012 PARIS, France", 20, 90);

    // --- CADRE COORDONNÉES BANCAIRES ---
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(210, 210, 210);
    doc.roundedRect(15, 102, 180, 60, 2, 2, "FD");

    doc.setFillColor(19, 21, 19);
    doc.rect(15, 102, 180, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(233, 209, 143);
    doc.text("IDENTIFIANTS BANCAIRES INTERNATIONAUX (SEPA / SWIFT)", 20, 107.5);

    // IBAN
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text("IBAN (International Bank Account Number) :", 20, 119);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(19, 21, 19);
    doc.text("FR76 1751 5900 0008 5227 1555 930", 20, 126);

    // BIC / SWIFT
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text("BIC / Code SWIFT :", 20, 136);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(19, 21, 19);
    doc.text("QNTBFR22XXX", 20, 142);

    // Établissement
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text("Établissement bancaire :", 110, 136);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(19, 21, 19);
    doc.text("QONTO / Olinda SAS", 110, 142);

    // --- CADRE CONSIGNES VIREMENT ---
    doc.setFillColor(248, 245, 238);
    doc.setDrawColor(197, 160, 89);
    doc.roundedRect(15, 168, 180, 40, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(197, 160, 89);
    doc.text("INSTRUCTIONS DE VIREMENT OBLIGATOIRES", 20, 176);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    const instructions =
      "• Indiquez impérativement votre Nom complet et la référence de votre demande en libellé de virement.\n" +
      "• Dès l'ordre émis, transmettez l'avis d'exécution bancaire à contact@generalesquire.com.\n" +
      "• Les virements instantanés SEPA sont traités et confirmés sous 24 heures ouvrées.\n" +
      "• Pour toute assistance : contact@generalesquire.com | Espace Sécurisé en ligne.";
    doc.text(doc.splitTextToSize(instructions, 170), 20, 183);

    // --- PIED DE PAGE ---
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "© 2026 Cabinet General Esquire - 61 rue de Lyon, 75012 PARIS - Document confidentiel",
      105,
      285,
      { align: "center" }
    );

    doc.save("RIB_Officiel_General_Esquire.pdf");
  } catch (err) {
    console.error("Erreur génération RIB:", err);
  }
}