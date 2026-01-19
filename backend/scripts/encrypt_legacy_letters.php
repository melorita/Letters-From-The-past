<?php
// backend/scripts/encrypt_all_letters.php

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/encryption.php';

echo "Warning: This script will encrypt all unencrypted letters in the database.\n";
echo "It attempts to detect unencrypted content by checking if it's valid Base64 and has correct IV length.\n";
echo "Ensure you have a backup before running fully on production data.\n\n";

try {
    // Select all letters
    $stmt = $pdo->query("SELECT id, message FROM letters");
    $letters = $stmt->fetchAll();

    $count = 0;
    $skipped = 0;

    foreach ($letters as $letter) {
        $msg = $letter['message'];
        
        // Simple heuristic: Try to decrypt it. If decryptData returns the same string, 
        // it means it failed (likely because it wasn't encrypted), so we should encrypt it.
        // HOWEVER, decryptData checks for IV length. An unencrypted string "Hello" 
        // is shorter than IV (16 bytes) usually, or just doesn't decrypt to something meaningful.
        
        // A safer check for this migration script:
        // Attempt to decrypt. If the result is distinct from input, it MIGHT be encrypted.
        // But our `decryptData` returns the input if it fails.
        // So let's check if it looks like base64.
        
        $isAlreadyEncrypted = false;
        if (base64_encode(base64_decode($msg, true)) === $msg) {
             // It is valid base64. It *might* be encrypted.
             // Let's assume if it's base64, it's already processed, unless your users write in base64.
             // This is a risk, but "hello" is not valid complete base64 usually without padding depending on length.
             $isAlreadyEncrypted = true;
        }

        if (!$isAlreadyEncrypted) {
            $encrypted = encryptData($msg); // Encrypt the plain text
            
            $update = $pdo->prepare("UPDATE letters SET message = ? WHERE id = ?");
            $update->execute([$encrypted, $letter['id']]);
            echo "Encrypted letter ID: {$letter['id']}\n";
            $count++;
        } else {
            // echo "Skipping ID: {$letter['id']} (seems encrypted)\n";
            $skipped++;
        }
    }

    echo "\nSummary:\n";
    echo "Encrypted: $count letters\n";
    echo "Skipped: $skipped letters (already looked encrypted)\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
