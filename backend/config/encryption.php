<?php
// Function to encrypt data
function encryptData($data) {
    $key = $_ENV['ENCRYPTION_KEY'];
    $method = "AES-256-CBC";
    $ivLength = openssl_cipher_iv_length($method);
    $iv = openssl_random_pseudo_bytes($ivLength);
    
    $encrypted = openssl_encrypt($data, $method, $key, 0, $iv);
    
    // Return IV + Encrypted Data (Base64 encoded) so valid for storage
    return base64_encode($iv . $encrypted);
}

// Function to decrypt data
function decryptData($data) {
    if (empty($data)) return $data;

    $key = $_ENV['ENCRYPTION_KEY'];
    $method = "AES-256-CBC";
    $ivLength = openssl_cipher_iv_length($method);
    
    $data = base64_decode($data);
    
    // Safety check
    if (strlen($data) <= $ivLength) {
        return $data; // Return original if it doesn't look like our encrypted string
    }

    $iv = substr($data, 0, $ivLength);
    $encrypted = substr($data, $ivLength);
    
    $decrypted = openssl_decrypt($encrypted, $method, $key, 0, $iv);
    
    return $decrypted === false ? $data : $decrypted; // Fallback to raw data if decryption fails (e.g. old data)
}
?>
