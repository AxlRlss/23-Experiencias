<?php
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helpers.php';
require_once __DIR__.'/../config.php';

if (!isset($_GET['code'])) { echo 'error'; exit; }

// Intercambiar code por access_token
$tokenUrl = sprintf(
  'https://graph.facebook.com/v19.0/oauth/access_token?client_id=%s&redirect_uri=%s&client_secret=%s&code=%s',
  urlencode(FB_APP_ID), urlencode(FB_REDIRECT_URI), urlencode(FB_APP_SECRET), urlencode($_GET['code'])
);
$tokenResp = json_decode(file_get_contents($tokenUrl), true);
$accessToken = $tokenResp['access_token'] ?? null;
if (!$accessToken) { echo 'error'; exit; }

// Obtener perfil
$profileUrl = 'https://graph.facebook.com/me?fields=id,name,email,picture.width(256)&access_token=' . urlencode($accessToken);
$prof = json_decode(file_get_contents($profileUrl), true);
$fbId = $prof['id'] ?? null;
$email= $prof['email'] ?? null; // puede ser null si la cuenta no comparte email
$name = $prof['name'] ?? 'Usuario Facebook';
$avatar = $prof['picture']['data']['url'] ?? null;

if (!$fbId) { echo 'error'; exit; }

// Si no hay email, generamos alias único (para permitir la cuenta)
if (!$email) $email = "fb_user_{$fbId}@noemail.local";

$user = ensure_user_by_email($pdo, $name, $email, $avatar);

// Enlazar cuenta social si no existe
$stmt = $pdo->prepare("SELECT id FROM oauth_cuentas WHERE proveedor='facebook' AND proveedor_user_id=? LIMIT 1");
$stmt->execute([$fbId]);
if (!$stmt->fetch()) {
  $stmt = $pdo->prepare("INSERT INTO oauth_cuentas (usuario_id, proveedor, proveedor_user_id) VALUES (?,?,?)");
  $stmt->execute([$user['id'], 'facebook', $fbId]);
}

login_user($user);

// Redirige de vuelta a tu homepage logueado
header('Location: '.BASE_URL);
exit;
