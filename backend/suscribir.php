<?php
require_once __DIR__.'/db.php';

if ($_SERVER['REQUEST_METHOD']!=='POST') { http_response_code(405); exit; }
$email = trim($_POST['email'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { exit('error'); }

try {
  $stmt = $pdo->prepare("INSERT IGNORE INTO suscriptores (email) VALUES (?)");
  $stmt->execute([$email]);
  echo 'success';
} catch (PDOException $e) { echo 'error'; }
