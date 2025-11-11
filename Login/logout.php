<?php
// /login/logout.php
session_start();

// Borra todas las variables de sesión
$_SESSION = [];

// Destruye la sesión
if (ini_get("session.use_cookies")) {
  $params = session_get_cookie_params();
  setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
}
session_destroy();

// (Opcional) borra cookies propias si usas "remember me"
// setcookie('remember_token', '', time() - 3600, '/', '', false, true);

// Redirige al login con bandera de éxito
header("Location: index.html?logout=1");
exit;
