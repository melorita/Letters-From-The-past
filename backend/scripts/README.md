# Email Usage scripts

## Setup
1. Ensure you have run `composer install` in the `backend` directory.
2. Update `backend/config/mail.php` with your Google App Password.

## Scripts

### `test_email.php`
Verifies your email configuration is correct.
Usage: `php test_email.php [optional_recipient_email]`

### `process_letters.php`
Checks for any letters with an `unlock_date` in the past that haven't been emailed yet.
Usage: `php process_letters.php`
*Note: This script will automatically verify and add the `email_sent` column to your database if it's missing.*

## Automation
To make this work automatically, send up a Windows Task Scheduler task to run `php c:\xampp\htdocs\Letters-From-The-past\backend\scripts\process_letters.php` once every day.
