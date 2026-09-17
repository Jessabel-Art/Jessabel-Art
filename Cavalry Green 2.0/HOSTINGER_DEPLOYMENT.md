# Hostinger Deployment Guide

## 1) Build the static site

From the project root, run:

```bash
npm install
npm run build
```

This produces a deployable static bundle in `dist/`.

## 2) Upload to Hostinger public_html

1. Upload the contents of `dist/` to the root of your Hostinger `public_html` directory.
2. Keep the static pages and the PHP API folder together.
3. Ensure the site remains accessible at the production domain, such as `cavalrygreenllc.com`.

## 3) Create the MySQL database in Hostinger

In the Hostinger control panel:

1. Create a new MySQL database and user.
2. Record:
   - database host
   - database name
   - database username
   - database password
3. Use the schema file at `database/quote_requests.sql` to import the tables.

## 4) Copy the config template

Create a production config file at:

`public/api/config.php`

Copy the values from `public/api/config.example.php` and replace the placeholders with your actual Hostinger database and SMTP settings.

Important:

- `public/api/config.php` is the production file.
- `public/api/config.example.php` is a template only.
- `public/api/config.php` must not be committed to Git.

## 5) Add production credentials

The production file must include:

- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`
- `NOTIFICATION_EMAIL = cavalrygreenllc@gmail.com`

The placeholder-bearing files are:

- `public/api/config.example.php`
- `database/quote_requests.sql` (schema only; no credentials)

## 6) Confirm upload permissions

The upload path is:

`uploads/quote-requests/`

Ensure the web server can write new request folders and files. On Apache shared hosting, the upload directory should be writable by PHP and protected from script execution.

The project includes upload protection files under:

- `public/uploads/.htaccess`
- `public/uploads/quote-requests/.htaccess`

## 7) Test quote submission

1. Open the quote form at the production site.
2. Submit a valid request with at least one service selected.
3. Confirm that the form posts to `/api/quote-submit.php`.
4. Verify the page shows the success state after a successful backend response.
5. Try a file upload and confirm the 5-photo limit and 10 MB per-file limit are enforced.

## 8) Confirm database record creation

After a successful submission:

1. Open the Hostinger database manager.
2. Query `quote_requests`.
3. Confirm the new row was added with the request ID and form values.
4. Confirm the uploaded photo metadata appears in `quote_request_photos` when files are attached.

## 9) Confirm email delivery

1. Submit a test quote request.
2. Check the inbox for `cavalrygreenllc@gmail.com`.
3. Confirm the email subject matches `New Quote Request — {Customer Name}`.
4. Verify the email includes the request ID, name, phone, email, property/service location, selected services, contact preference, project details, timestamp, and photo count.

## 10) Final checks

- Confirm no secrets are committed to the repository.
- Confirm `public/api/config.php` is excluded via `.gitignore`.
- Confirm the exported site preserves `api/quote-submit.php`.
- Confirm `uploads/quote-requests/` exists and is writable.
- Confirm no raw database errors or stack traces are exposed to browser users.
