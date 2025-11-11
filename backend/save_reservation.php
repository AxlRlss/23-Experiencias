<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $event_id = $_POST['event_id'] ?? '';
    $name     = $_POST['name'] ?? '';
    $email    = $_POST['email'] ?? '';
    $phone    = $_POST['phone'] ?? '';
    $quantity = intval($_POST['quantity'] ?? 1);

    // Validaciones básicas
    if (!$event_id || !$name || !$email || !$phone || $quantity < 1) {
        die("Error: datos incompletos.");
    }

    $stmt = $mysqli->prepare("INSERT INTO reservas (event_id, name, email, phone, quantity) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $event_id, $name, $email, $phone, $quantity);

    if ($stmt->execute()) {
        echo "<h2>✅ Reserva confirmada</h2>";
        echo "<p>¡Gracias, $name! Tu reserva para el evento <strong>$event_id</strong> fue registrada.</p>";
        echo "<a href='/calendario.html'>Volver al calendario</a>";
    } else {
        echo "Error al guardar la reserva: " . $mysqli->error;
    }

    $stmt->close();
}
session_start();
if (!hash_equals($_SESSION['csrf_token'] ?? '', $_POST['csrf_token'] ?? '')) {
    die('Token inválido.');
}

?>
