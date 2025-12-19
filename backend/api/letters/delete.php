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

// Try to get data from GET parameters first (more reliable for DELETE requests)
$id = isset($_GET['id']) ? $_GET['id'] : null;
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

// Fallback to JSON body if not in URL
if (!$id || !$user_id) {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id ?? null;
    $user_id = $data->user_id ?? null;
}

if (!empty($id) && !empty($user_id)) {
    try {
        // Verify ownership before deleting
        $check_stmt = $pdo->prepare("SELECT id FROM letters WHERE id = ? AND user_id = ?");
        $check_stmt->execute([$id, $user_id]);

        if ($check_stmt->rowCount() > 0) {
            $delete_stmt = $pdo->prepare("DELETE FROM letters WHERE id = ?");
            if ($delete_stmt->execute([$id])) {
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Letter deleted successfully."]);
            } else {
                http_response_code(503);
                echo json_encode(["status" => "error", "message" => "Unable to delete letter."]);
            }
        } else {
            http_response_code(403); // Forbidden
            echo json_encode(["status" => "error", "message" => "You are not authorized to delete this letter."]);
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
