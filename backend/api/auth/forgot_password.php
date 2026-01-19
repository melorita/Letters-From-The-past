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
require_once '../../services/EmailService.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email)) {
    try {
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ?");
        $stmt->execute([$data->email]);
        $user = $stmt->fetch();

        if ($user) {
            // Generate token
            $token = bin2hex(random_bytes(32));
            // Ensure PHP and MySQL timezones match
            date_default_timezone_set('Etc/GMT-3'); // +03:00
            $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

            // Store token
            $insert = $pdo->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
            $insert->execute([$data->email, $token, $expires_at]);

            // Send Email
            $resetLink = "http://localhost:5173/reset-password?token=$token&email=" . urlencode($data->email);
            
            $emailService = new EmailService();
            $emailService->sendEmail(
                $data->email,
                "Reset Your Password",
                "<h1>Password Reset Request</h1>
                 <p>Hi {$user['name']},</p>
                 <p>We received a request to reset your password. Click the link below to set a new one:</p>
                 <p><a href='$resetLink'>$resetLink</a></p>
                 <p>If you didn't ask for this, you can safely ignore this email.</p>
                 <p>This link expires in 1 hour.</p>"
            );
        }

        // Always return success to prevent email enumeration
        http_response_code(200);
        echo json_encode(["message" => "If an account exists with that email, a reset link has been sent."]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "An error occurred."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Email is required."]);
}
?>
