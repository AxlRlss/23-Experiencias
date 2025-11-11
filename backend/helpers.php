<?php
if (session_status() === PHP_SESSION_NONE) session_start();

function login_user(array $user) {
  $_SESSION['user'] = [
    'id' => $user['id'],
    'nombre' => $user['nombre'],
    'email' => $user['email'],
    'avatar' => $user['avatar'] ?? null
  ];
}

function current_user() {
  return $_SESSION['user'] ?? null;
}

function ensure_user_by_email(PDO $pdo, $nombre, $email, $avatar = null) {
  // ¿Existe ya?
  $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email=? LIMIT 1");
  $stmt->execute([$email]);
  $u = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($u) return $u;

  // Crear
  $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, avatar) VALUES (?,?,?)");
  $stmt->execute([$nombre ?: 'Usuario', $email, $avatar]);
  $id = $pdo->lastInsertId();
  return ['id'=>$id,'nombre'=>$nombre ?: 'Usuario','email'=>$email,'avatar'=>$avatar];
}
