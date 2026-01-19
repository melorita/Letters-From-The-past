<?php
// backend/scripts/test_email.php

require_once __DIR__ . '/../services/EmailService.php';

// Get the target email from config or default to the sender for testing
$config = require __DIR__ . '/../config/mail.php';
$to = $config['smtp_user']; // Send to self by default

if (isset($argv[1])) {
    $to = $argv[1];
}

echo "Attempting to send test email to: $to\n";
echo "Using credentials for: " . $config['smtp_user'] . "\n";

$emailService = new EmailService();
$result = $emailService->sendEmail(
    $to, 
    "Test Email from Letters From The Past", 
    "If you are reading this, your email configuration is working correctly! 🚀"
);

if ($result['status'] === 'success') {
    echo "SUCCESS: Email sent successfully!\n";
} else {
    echo "ERROR: " . $result['message'] . "\n";
    echo "Please check your config/mail.php settings and ensure you are using an App Password.\n";
}
