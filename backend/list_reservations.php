<?php
require_once __DIR__ . '/db.php';

$result = $mysqli->query("SELECT * FROM reservas ORDER BY created_at DESC");
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Panel de Reservas · 23 Experiencias</title>
  <style>
    body { font-family: sans-serif; background:#f4f4f9; margin:20px; }
    table { border-collapse: collapse; width: 100%; background:#fff; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background:#ddd; }
  </style>
</head>
<body>
  <h1>Panel de Reservas</h1>
  <table>
    <tr>
      <th>ID</th>
      <th>Evento</th>
      <th>Nombre</th>
      <th>Email</th>
      <th>Teléfono</th>
      <th>Cantidad</th>
      <th>Fecha de creación</th>
    </tr>
    <?php while($row = $result->fetch_assoc()): ?>
    <tr>
      <td><?php echo $row['id']; ?></td>
      <td><?php echo htmlspecialchars($row['event_id']); ?></td>
      <td><?php echo htmlspecialchars($row['name']); ?></td>
      <td><?php echo htmlspecialchars($row['email']); ?></td>
      <td><?php echo htmlspecialchars($row['phone']); ?></td>
      <td><?php echo $row['quantity']; ?></td>
      <td><?php echo $row['created_at']; ?></td>
    </tr>
    <?php endwhile; ?>
  </table>
</body>
</html>
