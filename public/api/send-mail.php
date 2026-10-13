<?php
/**
 * Script de traitement et d'envoi d'e-mails transactionnels avec pièce jointe PDF
 * Conçu pour l'hébergement LWS.fr du Cabinet General Esquire (generalesquire.com).
 * Exécuté nativement sous Apache/PHP pour une délivrabilité optimale vers contact@generalesquire.com.
 */

// ─── Sécurité ─────────────────────────────────────────────────────────────
// Ce script était un relais ouvert : n'importe quel site pouvait lui faire
// envoyer un email (avec pièce jointe) à n'importe quelle adresse, et
// l'en-tête Reply-To acceptait des retours à la ligne (injection d'en-têtes).
// Règles appliquées désormais :
//   1. destinataires limités aux boîtes du cabinet (liste blanche) ;
//   2. requêtes acceptées seulement depuis le site (Origin/Referer) ;
//   3. aucun CR/LF dans les valeurs placées en en-tête ;
//   4. taille du corps et de la pièce jointe bornées ;
//   5. limite de débit par IP (fichier dans le répertoire temporaire) ;
//   6. champ piège « website » : rempli = robot, réponse muette.
const GE_ALLOWED_RECIPIENTS = ['contact@generalesquire.com', 'generalesquire@proton.me'];
const GE_ALLOWED_ORIGINS = ['https://generalesquire.com', 'https://www.generalesquire.com'];
const GE_MAX_BODY_BYTES = 6 * 1024 * 1024;   // 6 Mo de JSON (PDF base64 inclus)
const GE_MAX_PDF_BYTES = 4 * 1024 * 1024;    // 4 Mo de PDF décodé
const GE_RATE_LIMIT = 8;                      // requêtes...
const GE_RATE_WINDOW = 600;                   // ...par fenêtre de 10 minutes et par IP

function ge_respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function ge_header_safe(string $value): string {
    return trim(str_replace(["\r", "\n", "\0"], '', $value));
}

function ge_request_origin(): string {
    if (!empty($_SERVER['HTTP_ORIGIN'])) {
        return rtrim((string)$_SERVER['HTTP_ORIGIN'], '/');
    }
    if (!empty($_SERVER['HTTP_REFERER'])) {
        $parts = parse_url((string)$_SERVER['HTTP_REFERER']);
        if (!empty($parts['scheme']) && !empty($parts['host'])) {
            return $parts['scheme'] . '://' . $parts['host'];
        }
    }
    return '';
}

function ge_rate_limited(string $ip): bool {
    $file = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'ge_mail_rl_' . hash('sha256', $ip);
    $now = time();
    $hits = [];
    $fh = @fopen($file, 'c+');
    if ($fh === false) {
        return false; // pas de stockage disponible : on ne bloque pas le formulaire
    }
    flock($fh, LOCK_EX);
    $raw = stream_get_contents($fh);
    if ($raw) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $hits = array_values(array_filter($decoded, fn($t) => is_int($t) && $t > $now - GE_RATE_WINDOW));
        }
    }
    $limited = count($hits) >= GE_RATE_LIMIT;
    if (!$limited) {
        $hits[] = $now;
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $limited;
}

$origin = ge_request_origin();
$originAllowed = in_array($origin, GE_ALLOWED_ORIGINS, true);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
if ($originAllowed) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ge_respond($originAllowed ? 204 : 403, []);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ge_respond(405, ['success' => false, 'message' => 'Méthode non autorisée. Utilisez POST.']);
}

if (!$originAllowed) {
    ge_respond(403, ['success' => false, 'message' => 'Origine non autorisée.']);
}

$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > GE_MAX_BODY_BYTES) {
    ge_respond(413, ['success' => false, 'message' => 'Requête trop volumineuse.']);
}

if (ge_rate_limited((string)($_SERVER['REMOTE_ADDR'] ?? 'unknown'))) {
    ge_respond(429, ['success' => false, 'message' => 'Trop de demandes, réessayez dans quelques minutes.']);
}

// Récupération des données brutes JSON
$rawInput = file_get_contents('php://input', false, null, 0, GE_MAX_BODY_BYTES + 1);
if ($rawInput !== false && strlen($rawInput) > GE_MAX_BODY_BYTES) {
    ge_respond(413, ['success' => false, 'message' => 'Requête trop volumineuse.']);
}
$data = json_decode((string)$rawInput, true);

if (!$data || !is_array($data)) {
    $data = $_POST;
}

// Champ piège : invisible pour un humain, rempli par les robots.
if (!empty($data['website'])) {
    ge_respond(200, ['success' => true, 'message' => 'Notification transmise.']);
}

// Destinataire : liste blanche stricte, sinon refus (pas de repli silencieux).
$requestedTarget = !empty($data['targetEmail']) ? strtolower(ge_header_safe((string)$data['targetEmail'])) : 'contact@generalesquire.com';
if (!in_array($requestedTarget, GE_ALLOWED_RECIPIENTS, true)) {
    ge_respond(403, ['success' => false, 'message' => 'Destinataire non autorisé.']);
}
$targetEmail = $requestedTarget;

$subjectRaw  = !empty($data['subject']) ? ge_header_safe((string)$data['subject']) : (!empty($data['_subject']) ? ge_header_safe((string)$data['_subject']) : '[General Esquire] Notification de Formulaire');
$subjectRaw  = mb_substr($subjectRaw, 0, 200);
$replyToRaw  = !empty($data['replyTo']) ? $data['replyTo'] : (!empty($data['_replyto']) ? $data['_replyto'] : (!empty($data['Email']) ? $data['Email'] : ''));
$replyToRaw  = ge_header_safe((string)$replyToRaw);
// Reply-To n'est retenu que s'il s'agit d'une adresse valide (sinon : adresse du cabinet).
$replyTo     = filter_var($replyToRaw, FILTER_VALIDATE_EMAIL) ? $replyToRaw : 'contact@generalesquire.com';
$fields      = !empty($data['fields']) && is_array($data['fields']) ? $data['fields'] : [];

// Si les champs sont au premier niveau du JSON (format clé/valeur direct)
if (empty($fields)) {
    foreach ($data as $k => $v) {
        if (!in_array($k, ['targetEmail', 'subject', 'replyTo', 'attachmentBase64', 'attachmentFilename', '_attachment', '_subject', '_replyto', 'website'])) {
            $fields[$k] = is_array($v) ? implode(', ', $v) : (string)$v;
        }
    }
}

// Pièce jointe PDF
$attachmentBase64 = $data['attachmentBase64'] ?? $data['_attachment'] ?? null;
$attachmentFilename = (string)($data['attachmentFilename'] ?? 'Formulaire_General_Esquire.pdf');

// Nettoyage de la base64
$pdfBinary = null;
if (!empty($attachmentBase64) && is_string($attachmentBase64)) {
    $cleanB64 = preg_replace('#^data:application/pdf;base64,#i', '', $attachmentBase64);
    $cleanB64 = preg_replace('#^data:image/[a-z]+;base64,#i', '', $cleanB64);
    $cleanB64 = str_replace(' ', '+', trim($cleanB64));
    $pdfBinary = base64_decode($cleanB64, true);
    // On n'accepte qu'un vrai PDF, de taille raisonnable.
    if ($pdfBinary === false || strlen($pdfBinary) > GE_MAX_PDF_BYTES || strncmp($pdfBinary, '%PDF', 4) !== 0) {
        $pdfBinary = null;
    }
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
$headers .= "Reply-To: " . $replyTo . "\r\n";
$headers .= "Cc: generalesquire@proton.me\r\n";
$headers .= "MIME-Version: 1.0\r\n";

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
    'hasAttachment' => !empty($pdfBinary)
]);