<?php
return [
    'smtp_host' => $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com',
    'smtp_port' => $_ENV['SMTP_PORT'] ?? 587,
    'smtp_user' => $_ENV['SMTP_USER'] ?? 'melatw2005@gmail.com',
    'smtp_pass' => $_ENV['SMTP_PASS'] ?? '', // This MUST be set in .env
    'smtp_secure' => $_ENV['SMTP_SECURE'] ?? 'tls',
    'from_email' => $_ENV['FROM_EMAIL'] ?? 'melatw2005@gmail.com',
    'from_name' => $_ENV['FROM_NAME'] ?? 'Letters From The Past',
];
