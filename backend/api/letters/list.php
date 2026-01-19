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

$user_id = $_GET['user_id'] ?? null;

if ($user_id) {
    try {
        // We select most fields but notice we could conditionally hide 'message' here too
        // or just return everything and let the frontend handle the locked state logic
        // but the roadmap says: "Backend decides if it’s readable (not frontend)"
        $stmt = $pdo->prepare("SELECT id, title, mood, unlock_date, is_opened, created_at, 
                               CASE WHEN unlock_date <= CURDATE() THEN message ELSE NULL END as message,
                               CASE WHEN unlock_date <= CURDATE() THEN 'open' ELSE 'locked' END as status
                               FROM letters WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        $letters = $stmt->fetchAll();

        // Decrypt opened letters
        require_once '../../config/encryption.php';
        foreach ($letters as &$letter) {
            if ($letter['message'] !== null) {
                $letter['message'] = decryptData($letter['message']);
            }
        }

        echo json_encode([
            "status" => "success",
            "letters" => $letters
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "User ID is required."]);
}
?>
