<?php
// Create connection
$conn = new mysqli("host", "username", "password", "database");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$stmt = $conn->prepare("delete from Actor where actName = ?");
$stmt->bind_param("s", $_POST["actName"]);
$stmt->execute();

header('Location: index.html');
?>