<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    try {
        // Check if user already exists
        $check_stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $check_stmt->execute([$data->email]);
        
        if ($check_stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["message" => "User already exists."]);
            exit();
        }

        $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)");
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

        if ($stmt->execute([$data->email, $password_hash, $data->name ?? null])) {
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "User was created.",
                "user" => [
                    "id" => $pdo->lastInsertId(),
                    "email" => $data->email,
                    "name" => $data->name ?? null
                ]
            ]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create user."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
