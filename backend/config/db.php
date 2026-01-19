<?php
$host = 'localhost';
$db_name = 'time_capsule';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec("SET time_zone = '+03:00'"); // Sync with user's local time observed in logs
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
