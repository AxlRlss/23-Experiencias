<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $email = $_POST['email'];
  $password = $_POST['password'];

  $sql = "SELECT * FROM usuarios WHERE email='$email'";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
      session_start();
      $_SESSION['user'] = $row['username'];
      header("Location: ../index.html");
    } else {
      echo "Contraseña incorrecta";
    }
  } else {
    echo "Usuario no encontrado";
  }
}
?>
