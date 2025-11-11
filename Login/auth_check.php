<?php
// Incluye este archivo al inicio de cualquier página protegida (PHP)
session_start();
if (!isset($_SESSION['user'])) {
  header('Location: /login/index.html?auth=required');
  exit;
}
