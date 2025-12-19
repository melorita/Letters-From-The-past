<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/db.php';

// Try to get data from GET parameters first
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (!$user_id) {
    $data = json_decode(file_get_contents("php://input"));
    $user_id = $data->user_id ?? null;
}

if (!empty($user_id)) {
    try {
        $delete_stmt = $pdo->prepare("DELETE FROM letters WHERE user_id = ?");
        if ($delete_stmt->execute([$user_id])) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "All letters deleted successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Unable to delete letters."]);
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
