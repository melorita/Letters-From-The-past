<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../../uploads/';
    
    // Create directory if it doesn't exist (redundant check but safe)
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileTmpPath = $_FILES['avatar']['tmp_name'];
    $fileName = $_FILES['avatar']['name'];
    $fileSize = $_FILES['avatar']['size'];
    $fileType = $_FILES['avatar']['type'];
    
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));

    $allowedfileExtensions = array('jpg', 'gif', 'png', 'jpeg', 'webp');
    
    if (in_array($fileExtension, $allowedfileExtensions)) {
        // Generate unique name to prevent cache issues and collisions
        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
        $dest_path = $uploadDir . $newFileName;

        if(move_uploaded_file($fileTmpPath, $dest_path)) {
            // Return the URL relative to the server root for the frontend to use
            // Assuming the frontend needs a full URL or a relative path it can construct
            // Let's return the full URL based on the server location
            // If backend is at localhost/letter/backend, uploads is at localhost/letter/backend/uploads
            
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            // This assumes the script is inside /letter/backend/api/auth/
            // So we need to go up two levels to get to /letter/backend/
            $path = "/letter/backend/uploads/" . $newFileName;
            
            $url = $protocol . $host . $path;

            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "File uploaded successfully",
                "url" => $url
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error", 
                "message" => "There was an error moving the uploaded file."
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "status" => "error", 
            "message" => "Upload failed. Allowed file types: " . implode(',', $allowedfileExtensions)
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "No file uploaded or upload error."
    ]);
}
?>
