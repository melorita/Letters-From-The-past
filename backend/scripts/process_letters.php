<?php
// backend/scripts/process_letters.php

// Adjust paths as necessary
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/EmailService.php';
require_once __DIR__ . '/../config/encryption.php'; // Add encryption helper

echo "Checking for due letters...\n";

try {
    // Auto-migration: Check if email_sent column exists, if not, create it
    try {
        $pdo->query("SELECT email_sent FROM letters LIMIT 1");
    } catch (PDOException $e) {
        echo "Adding 'email_sent' column to letters table...\n";
        $pdo->exec("ALTER TABLE letters ADD COLUMN email_sent BOOLEAN DEFAULT FALSE");
        echo "Column added.\n";
    }

    // Select letters that are due and haven't been emailed yet
    // Also ensuring the user wants notifications
    $stmt = $pdo->prepare("
        SELECT l.*, u.email, u.name as user_name 
        FROM letters l 
        JOIN users u ON l.user_id = u.id 
        WHERE l.unlock_date <= CURRENT_DATE() 
        AND (l.email_sent = 0 OR l.email_sent IS NULL)
        AND u.email_notifications = 1
    ");
    
    $stmt->execute();
    $letters = $stmt->fetchAll();
    
    $count = count($letters);
    echo "Found {$count} letters due for delivery.\n";

    if ($count > 0) {
        $emailService = new EmailService();

        foreach ($letters as $letter) {
            echo "Processing letter ID: {$letter['id']} for user: {$letter['email']}...\n";
            
            $title = $letter['title'] ?: 'Untitled Letter';
            $subject = "Your Time Capsule has opened: " . $title;
            
            // Basic template
            $body = "
                <div style='font-family: serif; color: #333; padding: 20px; background-color: #fcfcfc;'>
                    <h1 style='color: #444;'>Hello {$letter['user_name']},</h1>
                    <p>A letter you sealed in the past has finally been unlocked.</p>
                    <div style='border: 1px solid #eee; padding: 20px; background: #fff; border-radius: 8px; margin: 20px 0;'>
                        <p><strong>Date Sealed:</strong> " . date('F j, Y', strtotime($letter['created_at'])) . "</p>
                        <p><strong>Mood:</strong> {$letter['mood']}</p>
                        <hr style='border: 0; border-top: 1px solid #eee; margin: 15px 0;'>
                        <h2 style='margin-top:0;'>{$title}</h2>
                        <div style='white-space: pre-wrap;'>" . nl2br(htmlspecialchars(decryptData($letter['message']))) . "</div>
                    </div>
                    <p style='font-size: 0.9em; color: #888;'>
                        <a href='http://localhost:5173'>View in Your Vault</a>
                    </p>
                </div>
            ";

            $result = $emailService->sendEmail($letter['email'], $subject, $body);

            if ($result['status'] === 'success') {
                $update = $pdo->prepare("UPDATE letters SET email_sent = 1 WHERE id = ?");
                $update->execute([$letter['id']]);
                echo " [SUCCESS] Email sent to {$letter['email']}\n";
            } else {
                echo " [ERROR] Failed to send: {$result['message']}\n";
            }
        }
    }

    // ---------------------------------------------------------
    // EARLY REMINDERS (1 Day Before)
    // ---------------------------------------------------------
    
    // Auto-migration: Check if reminder_sent column exists
    try {
        $pdo->query("SELECT reminder_sent FROM letters LIMIT 1");
    } catch (PDOException $e) {
        echo "Adding 'reminder_sent' column to letters table...\n";
        $pdo->exec("ALTER TABLE letters ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE");
        echo "Column added.\n";
    }

    echo "Checking for early reminders (due tomorrow)...\n";

    $stmtReminder = $pdo->prepare("
        SELECT l.*, u.email, u.name as user_name 
        FROM letters l 
        JOIN users u ON l.user_id = u.id 
        WHERE l.unlock_date = DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY) 
        AND (l.reminder_sent = 0 OR l.reminder_sent IS NULL)
        AND u.early_reminders = 1
    ");

    $stmtReminder->execute();
    $reminders = $stmtReminder->fetchAll();
    
    $rCount = count($reminders);
    echo "Found {$rCount} letters due for reminder.\n";

    if ($rCount > 0) {
        if (!isset($emailService)) $emailService = new EmailService();

        foreach ($reminders as $letter) {
            echo "Sending reminder for letter ID: {$letter['id']}...\n";
            
            $title = $letter['title'] ?: 'Untitled Letter';
            $subject = "Tomorrow's the day: " . $title;
            
            $body = "
                <div style='font-family: serif; color: #333; padding: 20px; background-color: #fcfcfc;'>
                    <h1 style='color: #444;'>Get Ready, {$letter['user_name']}!</h1>
                    <p>A time capsule you sealed is scheduled to open <strong>tomorrow</strong>.</p>
                    <div style='border: 1px solid #eee; padding: 20px; background: #fff; border-radius: 8px; margin: 20px 0;'>
                        <h2 style='margin-top:0;'>{$title}</h2>
                        <p>It's almost time to reconnect with your past self.</p>
                    </div>
                    <p style='font-size: 0.9em; color: #888;'>
                        <a href='http://localhost:5173'>Visit Your Vault</a>
                    </p>
                </div>
            ";

            $result = $emailService->sendEmail($letter['email'], $subject, $body);

            if ($result['status'] === 'success') {
                $update = $pdo->prepare("UPDATE letters SET reminder_sent = 1 WHERE id = ?");
                $update->execute([$letter['id']]);
                echo " [SUCCESS] Reminder sent to {$letter['email']}\n";
            } else {
                echo " [ERROR] Failed to send reminder: {$result['message']}\n";
            }
        }
    }

} catch (Exception $e) {
    echo "An error occurred: " . $e->getMessage() . "\n";
}

echo "Done.\n";
?>
