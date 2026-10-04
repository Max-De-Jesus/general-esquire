<?php
/**
 * Script de traitement et d'envoi d'e-mails transactionnels avec pièce jointe PDF
 * Conçu pour l'hébergement LWS.fr du Cabinet General Esquire (generalesquire.com).
 * Exécuté nativement sous Apache/PHP pour une délivrabilité optimale vers contact@generalesquire.com.
 */

// Headers CORS complets
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
    exit;
}

// Récupération des données brutes JSON
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || !is_array($data)) {
    $data = $_POST;
}

// Extraction des paramètres clés
$targetEmail = !empty($data['targetEmail']) ? trim($data['targetEmail']) : 'contact@generalesquire.com';
$subjectRaw  = !empty($data['subject']) ? trim($data['subject']) : (!empty($data['_subject']) ? trim($data['_subject']) : '[General Esquire] Notification de Formulaire');
$replyTo     = !empty($data['replyTo']) ? trim($data['replyTo']) : (!empty($data['_replyto']) ? trim($data['_replyto']) : (!empty($data['Email']) ? trim($data['Email']) : 'contact@generalesquire.com'));
$fields      = !empty($data['fields']) && is_array($data['fields']) ? $data['fields'] : [];

// Si les champs sont au premier niveau du JSON (format clé/valeur direct)
if (empty($fields)) {
    foreach ($data as $k => $v) {
        if (!in_array($k, ['targetEmail', 'subject', 'replyTo', 'attachmentBase64', 'attachmentFilename', '_attachment', '_subject', '_replyto'])) {
            $fields[$k] = is_array($v) ? implode(', ', $v) : (string)$v;
        }
    }
}

// Pièce jointe PDF
$attachmentBase64 = $data['attachmentBase64'] ?? $data['_attachment'] ?? null;
$attachmentFilename = $data['attachmentFilename'] ?? 'Formulaire_General_Esquire.pdf';

// Nettoyage de la base64
$pdfBinary = null;
if (!empty($attachmentBase64) && is_string($attachmentBase64)) {
    $cleanB64 = preg_replace('#^data:application/pdf;base64,#i', '', $attachmentBase64);
    $cleanB64 = preg_replace('#^data:image/[a-z]+;base64,#i', '', $cleanB64);
    $cleanB64 = str_replace(' ', '+', trim($cleanB64));
    $pdfBinary = base64_decode($cleanB64, true);
}

// Construction du tableau HTML des informations
$tableRows = '';
foreach ($fields as $label => $val) {
    $escLabel = htmlspecialchars((string)$label, ENT_QUOTES, 'UTF-8');
    $escVal   = nl2br(htmlspecialchars((string)$val, ENT_QUOTES, 'UTF-8'));
    $tableRows .= "<tr>\n";
    $tableRows .= "  <td style='padding:10px 14px;border-bottom:1px solid #e8e3d6;font-weight:bold;color:#131513;background:#faf8f5;width:35%;font-size:13px;'>" . $escLabel . "</td>\n";
    $tableRows .= "  <td style='padding:10px 14px;border-bottom:1px solid #e8e3d6;color:#2c2c2c;font-size:13px;line-height:1.5;'>" . $escVal . "</td>\n";
    $tableRows .= "</tr>\n";
}

$dateFr = date('d/m/Y à H:i:s');
$escSubject = htmlspecialchars($subjectRaw, ENT_QUOTES, 'UTF-8');

$htmlBody = '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Notification General Esquire</title>
</head>
<body style="margin:0;padding:20px;background-color:#f4f1eb;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:650px;margin:0 auto;background:#ffffff;border:1px solid #C5A059;border-radius:10px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);">
        <!-- En-tête Cabinet -->
        <div style="background-color:#131513;padding:26px 20px;text-align:center;border-bottom:3px solid #C5A059;">
            <h1 style="color:#E9D18F;margin:0;font-size:22px;letter-spacing:3px;font-family:Georgia,serif;">GENERAL ESQUIRE</h1>
            <p style="color:#C5A059;margin:6px 0 0 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Cabinet de Conseil Juridique &amp; Chrysalides</p>
        </div>

        <!-- Corps -->
        <div style="padding:30px 24px;">
            <div style="border-bottom:2px solid #C5A059;padding-bottom:12px;margin-bottom:20px;">
                <h2 style="color:#131513;margin:0 0 6px 0;font-size:17px;">' . $escSubject . '</h2>
                <div style="font-size:12px;color:#777;">Reçu le ' . $dateFr . ' (Heure de Paris)</div>
            </div>

            <table style="width:100%;border-collapse:collapse;border:1px solid #e8e3d6;border-radius:6px;overflow:hidden;">
                ' . $tableRows . '
            </table>';

if (!empty($pdfBinary)) {
    $htmlBody .= '
            <div style="margin-top:22px;padding:12px 16px;background:#eef6ee;border:1px solid #badbcc;border-radius:6px;color:#1e5e2e;font-size:13px;">
                📎 <strong>Fichier PDF officiel joint :</strong> Le document officiel généré lors de la soumission est annexé à ce message.
            </div>';
}

$htmlBody .= '
        </div>

        <!-- Pied de page -->
        <div style="background-color:#1a1c1a;padding:16px 20px;text-align:center;font-size:11px;color:#aaa;border-top:1px solid #C5A059;">
            © ' . date('Y') . ' Cabinet General Esquire - 61 rue de Lyon, 75012 PARIS<br>
            Notification transactionnelle officielle acheminée vers contact@generalesquire.com (redirection automatique proton.me)
        </div>
    </div>
</body>
</html>';

// Construction de l'e-mail MIME
$boundary = 'GE_MIXED_' . md5(uniqid((string)mt_rand(), true));

$subjectEncoded = '=?UTF-8?B?' . base64_encode($subjectRaw) . '?=';

$headers  = "From: General Esquire <formulaire@generalesquire.com>\r\n";
$headers .= "Reply-To: " . (!empty($replyTo) ? $replyTo : 'contact@generalesquire.com') . "\r\n";
$headers .= "Cc: generalesquire@proton.me\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "X-Mailer: GeneralEsquire-PHP/" . phpversion() . "\r\n";

if (!empty($pdfBinary)) {
    $headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

    $body  = "--" . $boundary . "\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $htmlBody . "\r\n\r\n";

    // Pièce jointe PDF
    $safeFilename = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $attachmentFilename);
    if (!str_ends_with(strtolower($safeFilename), '.pdf')) {
        $safeFilename .= '.pdf';
    }

    $body .= "--" . $boundary . "\r\n";
    $body .= "Content-Type: application/pdf; name=\"" . $safeFilename . "\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "Content-Disposition: attachment; filename=\"" . $safeFilename . "\"\r\n\r\n";
    $body .= chunk_split(base64_encode($pdfBinary)) . "\r\n\r\n";

    $body .= "--" . $boundary . "--";
} else {
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";
    $body = $htmlBody;
}

// Envoi vers le destinataire officiel (contact@generalesquire.com)
$mailSent = @mail($targetEmail, $subjectEncoded, $body, $headers);

// Envoi d'une confirmation au client si courriel valide
if (!empty($replyTo) && filter_var($replyTo, FILTER_VALIDATE_EMAIL) && $replyTo !== 'contact@generalesquire.com' && $replyTo !== 'generalesquire@proton.me') {
    $clientSubject = '=?UTF-8?B?' . base64_encode('Accusé de réception de votre demande - Cabinet General Esquire') . '?=';
    $clientHeaders  = "From: Cabinet General Esquire <contact@generalesquire.com>\r\n";
    $clientHeaders .= "Reply-To: contact@generalesquire.com\r\n";
    $clientHeaders .= "MIME-Version: 1.0\r\n";
    $clientHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
    $clientHeaders .= "Content-Transfer-Encoding: 8bit\r\n";

    $clientBody = '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#f4f1eb;font-family:Arial,sans-serif;">
    <div style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #C5A059;border-radius:8px;padding:28px;">
        <div style="text-align:center;border-bottom:2px solid #C5A059;padding-bottom:14px;margin-bottom:18px;">
            <h2 style="color:#131513;margin:0;">Cabinet General Esquire</h2>
            <span style="color:#C5A059;font-size:12px;text-transform:uppercase;">Conseil Juridique & Chrysalides</span>
        </div>
        <p style="color:#333;font-size:14px;line-height:1.6;">
            Bonjour,<br><br>
            Nous vous confirmons la bonne réception de votre demande sur la plateforme officielle <strong>General Esquire</strong>.
            Notre équipe examine vos éléments et prendra contact avec vous dans les meilleurs délais.
        </p>
        <p style="color:#555;font-size:13px;line-height:1.5;">
            Votre document récapitulatif officiel a été généré et téléchargé au format PDF directement sur votre appareil lors de votre validation.
        </p>
        <div style="margin-top:26px;padding-top:14px;border-top:1px solid #eee;font-size:12px;color:#777;">
            Cabinet General Esquire - 61 rue de Lyon, 75012 PARIS<br>
            Courriel : contact@generalesquire.com
        </div>
    </div>
</body>
</html>';

    @mail($replyTo, $clientSubject, $clientBody, $clientHeaders);
}

echo json_encode([
    'success' => $mailSent,
    'message' => $mailSent ? 'Notification transmise avec succès avec pièce jointe PDF.' : 'Traitement effectué.',
    'target' => $targetEmail,
    'hasAttachment' => !empty($pdfBinary)
]);