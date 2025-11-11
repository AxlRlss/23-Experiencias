<?php
$host = "localhost";
$user = "root"; // Cambia si tu servidor usa otro usuario
$pass = ""; // Tu contraseña MySQL
$dbname = "experiencias_db";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
}
?>

<?php
$servername = "localhost";
$username = "root"; // o el usuario de tu hosting
$password = "";     // tu contraseña
$dbname = "experiencias"; // nombre de tu BD

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>

<?php
require_once __DIR__ . '/config.php';

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($mysqli->connect_errno) {
    die("Error de conexión MySQL: " . $mysqli->connect_error);
}

// Importante: usar siempre consultas preparadas
?>
