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

if (
    !empty($data->user_id) &&
    !empty($data->message) &&
    !empty($data->unlock_date)
) {
    try {
        $stmt = $pdo->prepare("INSERT INTO letters (user_id, title, message, mood, unlock_date) VALUES (?, ?, ?, ?, ?)");
        
        $title = $data->title ?? 'Untitled Letter';
        $mood = $data->mood ?? null;

        if ($stmt->execute([$data->user_id, $title, $data->message, $mood, $data->unlock_date])) {
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "Letter created successfully.",
                "id" => $pdo->lastInsertId()
            ]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create letter."]);
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
