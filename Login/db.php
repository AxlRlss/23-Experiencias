<?php
$servername = "localhost";
$username = "root"; // cambia según tu servidor
$password = "";     // tu contraseña
$dbname = "experiencias_db";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar
if ($conn->connect_error) {
  die("Conexión fallida: " . $conn->connect_error);
}
?>
