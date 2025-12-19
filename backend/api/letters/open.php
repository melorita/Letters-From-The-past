<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->user_id)) {
    try {
        // First check if it's actually unlockable
        $check_stmt = $pdo->prepare("SELECT unlock_date FROM letters WHERE id = ? AND user_id = ?");
        $check_stmt->execute([$data->id, $data->user_id]);
        $letter = $check_stmt->fetch();

        if ($letter) {
            $today = date('Y-m-d');
            if ($today >= $letter['unlock_date']) {
                $stmt = $pdo->prepare("UPDATE letters SET is_opened = TRUE, opened_at = NOW() WHERE id = ? AND user_id = ?");
                if ($stmt->execute([$data->id, $data->user_id])) {
                    echo json_encode([
                        "status" => "success",
                        "message" => "Letter marked as opened."
                    ]);
                } else {
                    http_response_code(503);
                    echo json_encode(["message" => "Unable to update letter."]);
                }
            } else {
                http_response_code(403);
                echo json_encode(["message" => "This letter is still locked."]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Letter not found."]);
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
