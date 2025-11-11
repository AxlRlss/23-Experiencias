<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $username = $_POST['username'];
  $email = $_POST['email'];
  $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

  $sql = "INSERT INTO usuarios (username, email, password) VALUES ('$username','$email','$password')";
  if ($conn->query($sql) === TRUE) {
    header("Location: index.html?success=1");
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
?>
