<?php
// Create connection
$conn = new mysqli("host", "username", "password", "database");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("select actID from Actor where actName = '"  . $_POST["actFirstName"] . " " . $_POST["actLastName"] . "';");
$actID = $result->fetch_assoc()["actID"];

$stmt = $conn->prepare("insert into Movie (actID, mvTitle, mvPrice, mvYear, mvGenre) values (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $actID, $_POST["mvTitle"], $_POST["mvPrice"], $_POST["mvYear"], $_POST["mvGenre"]);
$stmt->execute();

header('Location: dashboard.html');
?>