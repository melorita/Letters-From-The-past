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

if (!empty($data->email) && !empty($data->token) && !empty($data->new_password)) {
    try {
        // Verify token
        $stmt = $pdo->prepare("SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()");
        $stmt->execute([$data->email, $data->token]);
        $resetRequest = $stmt->fetch();

        if ($resetRequest) {
            // Update password
            $password_hash = password_hash($data->new_password, PASSWORD_BCRYPT);
            $update = $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
            
            if ($update->execute([$password_hash, $data->email])) {
                // Delete used token
                $delete = $pdo->prepare("DELETE FROM password_resets WHERE email = ?");
                $delete->execute([$data->email]);

                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Password has been successfully reset."]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to update password."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Invalid or expired token."]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "An error occurred."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
