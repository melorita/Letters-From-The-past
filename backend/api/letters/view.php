<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/db.php';

$id = $_GET['id'] ?? null;
$user_id = $_GET['user_id'] ?? null; // For security, check if user owns it

if ($id && $user_id) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM letters WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user_id]);
        $letter = $stmt->fetch();

        if ($letter) {
            $today = date('Y-m-d');
            if ($today >= $letter['unlock_date']) {
                echo json_encode([
                    "status" => "open",
                    "letter" => $letter
                ]);
            } else {
                echo json_encode([
                    "status" => "locked",
                    "message" => "This letter is not ready yet.",
                    "unlock_date" => $letter['unlock_date']
                ]);
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
    echo json_encode(["message" => "Letter ID and User ID are required."]);
}
?>
