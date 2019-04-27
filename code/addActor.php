<?php
// Create connection
$conn = new mysqli("host", "username", "password", "database");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$stmt = $conn->prepare("insert into Actor (actName) values (?)");
$stmt->bind_param("s", $name);
$name = "{$_POST["actFirstName"]} {$_POST["actLastName"]}";
$stmt->execute();

header('Location: dashboard.html');
?>