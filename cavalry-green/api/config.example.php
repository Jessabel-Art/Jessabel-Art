<?php

$envOrDefault = static function (string $name, string $default): string {
    $value = getenv($name);
    if (is_string($value) && trim($value) !== '') {
        return trim($value);
    }

    $value = $_ENV[$name] ?? null;
    if (is_string($value) && trim($value) !== '') {
        return trim($value);
    }

    return $default;
};

define('DB_HOST', $envOrDefault('DB_HOST', 'localhost'));
define('DB_PORT', $envOrDefault('DB_PORT', '3306'));
define('DB_NAME', $envOrDefault('DB_NAME', 'your_database_name'));
define('DB_USER', $envOrDefault('DB_USER', 'your_database_user'));
define('DB_PASSWORD', $envOrDefault('DB_PASSWORD', 'your_database_password'));

define('SMTP_HOST', $envOrDefault('SMTP_HOST', 'smtp.gmail.com'));
define('SMTP_PORT', (int) $envOrDefault('SMTP_PORT', '587'));
define('SMTP_USERNAME', $envOrDefault('SMTP_USERNAME', 'your_smtp_username'));
define('SMTP_PASSWORD', $envOrDefault('SMTP_PASSWORD', 'your_smtp_password'));
define('SMTP_FROM_EMAIL', $envOrDefault('SMTP_FROM_EMAIL', 'noreply@yourdomain.com'));
define('SMTP_FROM_NAME', $envOrDefault('SMTP_FROM_NAME', 'Cavalry Green LLC'));
define('NOTIFICATION_EMAIL', $envOrDefault('NOTIFICATION_EMAIL', 'cavalrygreenllc@gmail.com'));
define('SMTP_SECURE', $envOrDefault('SMTP_SECURE', 'tls'));
