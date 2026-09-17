CREATE TABLE IF NOT EXISTS quote_requests (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    request_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    property_address VARCHAR(255) NOT NULL,
    services TEXT NOT NULL,
    preferred_contact_method VARCHAR(20) NOT NULL,
    project_details LONGTEXT NOT NULL,
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quote_request_photos (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    quote_request_id BIGINT UNSIGNED NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INT UNSIGNED NOT NULL,
    relative_path VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_quote_request_id (quote_request_id),
    CONSTRAINT fk_quote_request_photos_quote_request
        FOREIGN KEY (quote_request_id) REFERENCES quote_requests (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
