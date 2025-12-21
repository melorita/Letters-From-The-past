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
        $stmt = $pdo->prepare("UPDATE users SET name = ?, profile_pic = ?, email_notifications = ?, early_reminders = ? WHERE id = ?");
        
        $email_notif = isset($data->email_notifications) ? (int)$data->email_notifications : 1;
        $early_remind = isset($data->early_reminders) ? (int)$data->early_reminders : 1;

        if ($stmt->execute([$data->name ?? null, $data->profile_pic ?? null, $email_notif, $early_remind, $data->id])) {
            // Fetch updated user to return complete object
            $stmt = $pdo->prepare("SELECT id, name, email, profile_pic, email_notifications, early_reminders FROM users WHERE id = ?");
            $stmt->execute([$data->id]);
            $updatedUser = $stmt->fetch();

            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Profile updated successfully.",
                "user" => [
                    "id" => $updatedUser['id'],
                    "name" => $updatedUser['name'],
                    "email" => $updatedUser['email'],
                    "profile_pic" => $updatedUser['profile_pic'],
                    "email_notifications" => (bool)$updatedUser['email_notifications'],
                    "early_reminders" => (bool)$updatedUser['early_reminders']
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
