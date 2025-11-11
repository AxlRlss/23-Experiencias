<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: ../Axl/index.html");
    exit();
}

require 'db.php';

$user_id = $_SESSION['user_id'];
$pack_nombre = $_POST['pack_nombre'];
$fecha = $_POST['fecha'];
$cantidad = $_POST['cantidad'];
$metodo_pago = $_POST['metodo_pago'];

$sql = "INSERT INTO compras (user_id, pack_nombre, fecha, cantidad, metodo_pago)
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("issis", $user_id, $pack_nombre, $fecha, $cantidad, $metodo_pago);

if ($stmt->execute()) {
    echo "<script>alert('¡Compra registrada con éxito!'); window.location='../index.html';</script>";
} else {
    echo "Error: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
