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

if (!empty($data->id)) {
    try {
        $stmt = $pdo->prepare("UPDATE users SET name = ?, profile_pic = ? WHERE id = ?");
        
        if ($stmt->execute([$data->name ?? null, $data->profile_pic ?? null, $data->id])) {
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Profile updated successfully.",
                "user" => [
                    "id" => $data->id,
                    "name" => $data->name ?? null,
                    "profile_pic" => $data->profile_pic ?? null
                ]
            ]);
        } else {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Unable to update profile."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data."]);
}
?>
