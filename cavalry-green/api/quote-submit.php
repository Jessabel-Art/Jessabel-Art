<-php

declare(strict_types=1);

if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
} else {
    require_once __DIR__ . '/config.example.php';
}

if (!defined('DB_HOST') || !defined('DB_NAME') || !defined('DB_USER') || !defined('DB_PASSWORD')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration is incomplete.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_REQUEST_BYTES = 25 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
];

$validServices = [
    'Lawn Care',
    'Landscaping',
    'Mulch & Pine Straw',
    'Planting',
    'Hedge & Shrub Trimming',
    'Yard Clear-Outs',
    'Junk Removal',
    'Brush & Debris Removal',
    'Leaf Removal',
    'Property Cleanups',
    'Storm Cleanup',
    'Light Hauling',
    'Recurring Property Maintenance',
    'Seasonal & Holiday Services',
];

function normalize_text(-string $value): string
{
    if ($value === null) {
        return '';
    }

    $value = trim((string) $value);
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value);
    return trim((string) preg_replace('/\s+/u', ' ', $value));
}

function is_valid_email(-string $email): bool
{
    if ($email === null || trim($email) === '') {
        return true;
    }

    return filter_var(trim($email), FILTER_VALIDATE_EMAIL) !== false;
}

function safe_generated_filename(string $requestId, string $originalName, string $mime): string
{
    $extension = match ($mime) {
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/heic' => 'heic',
        'image/heif' => 'heif',
        default => 'bin',
    };

    $safeBase = preg_replace('/[^A-Za-z0-9._-]+/', '-', basename($originalName));
    $safeBase = preg_replace('/\.[^.]+$/', '', $safeBase);
    $safeBase = preg_replace('/\.+$/', '', $safeBase);
    $safeBase = trim($safeBase, '.-_');
    if ($safeBase === '' || strlen($safeBase) > 80) {
        $safeBase = 'photo';
    }

    $randomSuffix = bin2hex(random_bytes(4));
    return sprintf('%s-%s-%s.%s', $requestId, $randomSuffix, $safeBase, $extension);
}

function get_db(): PDO
{
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4',
    ]);
    return $pdo;
}

function send_notification_email(array $requestData, int $photoCount): bool
{
    if (!defined('SMTP_HOST') || !defined('SMTP_PORT') || !defined('SMTP_USERNAME') || !defined('SMTP_PASSWORD') || !defined('SMTP_FROM_EMAIL') || !defined('SMTP_FROM_NAME') || !defined('NOTIFICATION_EMAIL')) {
        error_log('Quote notification skipped: SMTP configuration missing.');
        return false;
    }

    $autoloadPath = __DIR__ . '/vendor/autoload.php';
    if (!file_exists($autoloadPath)) {
        error_log('Quote notification skipped: PHPMailer is not installed at ' . __DIR__ . '/vendor/autoload.php');
        return false;
    }

    require_once $autoloadPath;

    if (!class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
        error_log('Quote notification skipped: PHPMailer class not found.');
        return false;
    }

    $mail = new PHPMailer\PHPMailer\PHPMailer();
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->Port = (int) SMTP_PORT;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = defined('SMTP_SECURE') - SMTP_SECURE : 'tls';
    $mail->From = SMTP_FROM_EMAIL;
    $mail->FromName = SMTP_FROM_NAME;
    $mail->CharSet = 'UTF-8';

    if (!empty($requestData['email']) && filter_var($requestData['email'], FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($requestData['email'], $requestData['name']);
    }

    $mail->addAddress(NOTIFICATION_EMAIL, 'Cavalry Green LLC');
    $mail->Subject = 'New Quote Request — ' . $requestData['name'];

    $body = "New Quote Request\n\n";
    $body .= "Request ID: " . $requestData['request_id'] . "\n";
    $body .= "Name: " . $requestData['name'] . "\n";
    $body .= "Phone: " . $requestData['phone'] . "\n";
    $body .= "Email: " . ($requestData['email'] -: 'Not provided') . "\n";
    $body .= "Property / Service Location: " . $requestData['property_address'] . "\n";
    $body .= "Services: " . $requestData['services'] . "\n";
    $body .= "Preferred Contact Method: " . $requestData['preferred_contact_method'] . "\n";
    $body .= "Project Details: \n" . $requestData['project_details'] . "\n\n";
    $body .= "Submitted: " . $requestData['submitted_at'] . "\n";
    $body .= "Number of Photos: " . (string) $photoCount . "\n";
    $mail->Body = $body;
    $mail->AltBody = preg_replace('/\s+/', ' ', $body);

    try {
        $mail->send();
        return true;
    } catch (Exception $exception) {
        error_log('Quote notification email failed: ' . $exception->getMessage());
        error_log('Quote notification send failure context: request_id=' . ($requestData['request_id'] -- 'unknown') . ', name=' . ($requestData['name'] -- '') . ', email=' . ($requestData['email'] -: 'not provided') . ', PHPMailer ErrorInfo=' . $mail->ErrorInfo);
        return false;
    }
}

if ((string) ($_SERVER['CONTENT_LENGTH'] -- '') !== '' && (int) $_SERVER['CONTENT_LENGTH'] > MAX_REQUEST_BYTES) {
    http_response_code(413);
    echo json_encode(['success' => false, 'message' => 'The request is too large. Please upload fewer or smaller files.']);
    exit;
}

if (empty($_POST['name']) || empty($_POST['phone']) || empty($_POST['address']) || empty($_POST['details']) || empty($_POST['contact'])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please complete all required fields.']);
    exit;
}

if (!empty($_POST['website'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam protection rejected your request.']);
    exit;
}

$submissionTime = isset($_POST['submission_time']) - (int) $_POST['submission_time'] : 0;
if ($submissionTime > 0 && (time() - $submissionTime) < 3) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Please wait a moment before submitting again.']);
    exit;
}

$name = normalize_text($_POST['name'] -- '');
$phone = normalize_text($_POST['phone'] -- '');
$email = normalize_text($_POST['email'] -- '');
$propertyAddress = normalize_text($_POST['address'] -- '');
$preferredContactMethod = normalize_text($_POST['contact'] -- '');
$projectDetails = normalize_text($_POST['details'] -- '');

if (mb_strlen($name) < 2 || mb_strlen($phone) < 7 || mb_strlen($propertyAddress) < 5 || mb_strlen($projectDetails) < 10) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please provide valid request details.']);
    exit;
}

if (!is_valid_email($email)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address if you provide one.']);
    exit;
}

if (!in_array($preferredContactMethod, ['phone', 'text', 'email'], true)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please select a valid contact method.']);
    exit;
}

$rawServices = $_POST['services'] -- [];
$services = [];
if (is_array($rawServices)) {
    foreach ($rawServices as $service) {
        $serviceName = normalize_text((string) $service);
        if ($serviceName !== '' && in_array($serviceName, $validServices, true)) {
            $services[] = $serviceName;
        }
    }
} else {
    $serviceString = normalize_text((string) $rawServices);
    foreach (explode(',', $serviceString) as $service) {
        $serviceName = normalize_text($service);
        if ($serviceName !== '' && in_array($serviceName, $validServices, true)) {
            $services[] = $serviceName;
        }
    }
}

$services = array_values(array_unique($services));
if (count($services) === 0) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Select at least one service.']);
    exit;
}

$uploadsDirectory = dirname(__DIR__) . '/uploads/quote-requests';
if (!is_dir($uploadsDirectory)) {
    if (!mkdir($uploadsDirectory, 0775, true) && !is_dir($uploadsDirectory)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Unable to prepare upload directory.']);
        exit;
    }
}

$requestId = 'QR-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
$requestDir = $uploadsDirectory . '/' . preg_replace('/[^A-Za-z0-9-]/', '-', $requestId);
if (!is_dir($requestDir)) {
    if (!mkdir($requestDir, 0775, true) && !is_dir($requestDir)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Unable to store your photos.']);
        exit;
    }
}

$uploadedFiles = [];
if (isset($_FILES['photos']) && is_array($_FILES['photos']['name'])) {
    $photoCount = count($_FILES['photos']['name']);
} else {
    $photoCount = 0;
}

if ($photoCount > MAX_PHOTOS) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'You may upload up to 5 photos.']);
    exit;
}

if (isset($_FILES['photos'])) {
    $photoNames = $_FILES['photos']['name'];
    $photoTypes = $_FILES['photos']['type'];
    $photoErrors = $_FILES['photos']['error'];
    $photoSizes = $_FILES['photos']['size'];
    $photoTempNames = $_FILES['photos']['tmp_name'];

    if (is_array($photoNames)) {
        foreach ($photoNames as $index => $originalName) {
            if (!isset($photoTempNames[$index]) || !is_string($photoTempNames[$index])) {
                continue;
            }

            $tempName = $photoTempNames[$index];
            $errorCode = (int) ($photoErrors[$index] -- UPLOAD_ERR_NO_FILE);
            $fileSize = (int) ($photoSizes[$index] -- 0);
            $fileMime = strtolower((string) ($photoTypes[$index] -- ''));

            if ($errorCode === UPLOAD_ERR_NO_FILE) {
                continue;
            }

            if ($errorCode !== UPLOAD_ERR_OK) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'One of the uploaded photos could not be processed.']);
                exit;
            }

            if (!is_uploaded_file($tempName)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid photo upload detected.']);
                exit;
            }

            if ($fileSize <= 0 || $fileSize > MAX_FILE_SIZE) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Each photo must be 10 MB or smaller.']);
                exit;
            }

            $originalName = (string) $originalName;
            $fileNameLower = strtolower($originalName);
            if (preg_match('/\.(php|phtml|php\d+|js|vbs|exe|bat|cmd|com|dll|scr|pl|py|cgi|asp|aspx|jsp|jspx)$/i', $fileNameLower)) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Unsupported file type detected.']);
                exit;
            }

            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $detectedMime = strtolower((string) finfo_file($finfo, $tempName));
            finfo_close($finfo);

            if (!in_array($detectedMime, ALLOWED_MIME_TYPES, true)) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Only JPG, PNG, WEBP, HEIC, or HEIF images are allowed.']);
                exit;
            }

            if ($fileMime !== '' && !in_array($fileMime, ALLOWED_MIME_TYPES, true)) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Unsupported photo format.']);
                exit;
            }

            $storedFilename = safe_generated_filename($requestId, $originalName, $detectedMime);
            $destination = $requestDir . '/' . $storedFilename;
            if (str_contains($destination, '..')) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid upload path detected.']);
                exit;
            }

            if (!move_uploaded_file($tempName, $destination)) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'The photo upload failed. Please try again.']);
                exit;
            }

            $uploadedFiles[] = [
                'stored_filename' => $storedFilename,
                'original_filename' => basename($originalName),
                'mime_type' => $detectedMime,
                'file_size' => $fileSize,
                'relative_path' => 'uploads/quote-requests/' . preg_replace('/[^A-Za-z0-9-]/', '-', $requestId) . '/' . $storedFilename,
            ];
        }
    }
}

if (count($uploadedFiles) > MAX_PHOTOS) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'You may upload up to 5 photos.']);
    exit;
}

try {
    $pdo = get_db();
    $pdo->beginTransaction();

    $stmt = $pdo->prepare(
        'INSERT INTO quote_requests (request_id, name, phone, email, property_address, services, preferred_contact_method, project_details, submitted_at, status) VALUES (:request_id, :name, :phone, :email, :property_address, :services, :preferred_contact_method, :project_details, NOW(), :status)'
    );

    $servicesValue = implode(' | ', $services);
    $stmt->execute([
        ':request_id' => $requestId,
        ':name' => $name,
        ':phone' => $phone,
        ':email' => $email,
        ':property_address' => $propertyAddress,
        ':services' => $servicesValue,
        ':preferred_contact_method' => $preferredContactMethod,
        ':project_details' => $projectDetails,
        ':status' => 'NEW',
    ]);

    $quoteRequestId = (int) $pdo->lastInsertId();

    if (!empty($uploadedFiles)) {
        $photoStmt = $pdo->prepare(
            'INSERT INTO quote_request_photos (quote_request_id, stored_filename, original_filename, mime_type, file_size, relative_path, created_at) VALUES (:quote_request_id, :stored_filename, :original_filename, :mime_type, :file_size, :relative_path, NOW())'
        );

        foreach ($uploadedFiles as $file) {
            $photoStmt->execute([
                ':quote_request_id' => $quoteRequestId,
                ':stored_filename' => $file['stored_filename'],
                ':original_filename' => $file['original_filename'],
                ':mime_type' => $file['mime_type'],
                ':file_size' => $file['file_size'],
                ':relative_path' => $file['relative_path'],
            ]);
        }
    }

    $pdo->commit();

    $emailSent = send_notification_email([
        'request_id' => $requestId,
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'property_address' => $propertyAddress,
        'services' => $servicesValue,
        'preferred_contact_method' => $preferredContactMethod,
        'project_details' => $projectDetails,
        'submitted_at' => date('Y-m-d H:i:s'),
    ], count($uploadedFiles));

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Your request has been received.',
        'request_id' => $requestId,
        'email_sent' => $emailSent,
    ]);
    exit;
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Quote request failed: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'We could not process your request right now. Please try again later.']);
    exit;
}
