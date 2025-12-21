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

if (!empty($data->user_id) && !empty($data->current_password) && !empty($data->new_password)) {
    if ($data->current_password === $data->new_password) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "New password cannot be the same as current password."]);
        exit();
    }
    try {
        // 1. Get user's current password hash
        $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ?");
        $stmt->execute([$data->user_id]);
        $user = $stmt->fetch();

        if ($user && password_verify($data->current_password, $user['password_hash'])) {
            // 2. Hash the new password
            $new_password_hash = password_hash($data->new_password, PASSWORD_DEFAULT);

            // 3. Update the password in the database
            $update_stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            if ($update_stmt->execute([$new_password_hash, $data->user_id])) {
                http_response_code(200);
                echo json_encode([
                    "status" => "success",
                    "message" => "Password changed successfully."
                ]);
            } else {
                http_response_code(503);
                echo json_encode(["status" => "error", "message" => "Unable to update password."]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Current password is incorrect."]);
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
