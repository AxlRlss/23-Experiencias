<?php
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../helpers.php';
require_once __DIR__.'/../config.php';

// Espera POST: credential (ID token)
$idToken = $_POST['credential'] ?? '';
if (!$idToken) { http_response_code(400); exit('missing'); }

// Verificar el token llamando a Google
$resp = file_get_contents('https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken));
if ($resp === false) { http_response_code(400); exit('invalid'); }

$data = json_decode($resp, true);

// Validaciones mínimas
if (($data['aud'] ?? '') !== GOOGLE_CLIENT_ID) { http_response_code(401); exit('aud_mismatch'); }
$email = $data['email'] ?? null;
$name  = $data['name']  ?? 'Usuario Google';
$sub   = $data['sub']   ?? null; // Google user id
$avatar= $data['picture'] ?? null;

if (!$email || !$sub) { http_response_code(400); exit('missing_fields'); }

// Asegurar/crear usuario por email
$user = ensure_user_by_email($pdo, $name, $email, $avatar);

// Enlazar cuenta social si no existe
$stmt = $pdo->prepare("SELECT id FROM oauth_cuentas WHERE proveedor='google' AND proveedor_user_id=? LIMIT 1");
$stmt->execute([$sub]);
if (!$stmt->fetch()) {
  $stmt = $pdo->prepare("INSERT INTO oauth_cuentas (usuario_id, proveedor, proveedor_user_id) VALUES (?,?,?)");
  $stmt->execute([$user['id'], 'google', $sub]);
}

login_user($user);
echo 'success';
