"use client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { serviceFamilies } from "../components";
import { basePath } from "../basePath";

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

type PhotoItem = {
  id: string;
  file: File;
  preview?: string;
};

type QuoteStatus = "idle" | "submitting" | "success" | "error";

export default function QuoteForm() {
  const [status, setStatus] = useState<QuoteStatus>("idle");
  const [serviceError, setServiceError] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [requestStartedAt, setRequestStartedAt] = useState<number>(() =>
    Math.floor(Date.now() / 1000),
  );
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        if (photo.preview) URL.revokeObjectURL(photo.preview);
      });
    };
  }, [photos]);

  const revokePhotoPreviews = (nextPhotos: PhotoItem[]) => {
    nextPhotos.forEach((photo) => {
      if (photo.preview) URL.revokeObjectURL(photo.preview);
    });
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    if (!nextFiles.length) return;

    const validFiles: PhotoItem[] = [];
    const errors: string[] = [];
    const currentPhotos = [...photos];

    for (const file of nextFiles) {
      const mime = file.type.toLowerCase();
      const supportedMime = ALLOWED_MIME_TYPES.has(mime);
      const supportedExtension = /\.(jpe?g|png|webp|heic|heif)$/i.test(
        file.name,
      );

      if (!supportedMime && !supportedExtension) {
        errors.push(`${file.name} is not a supported photo format.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} exceeds the 10 MB limit.`);
        continue;
      }

      if (currentPhotos.length + validFiles.length >= MAX_PHOTOS) {
        errors.push("You can upload up to 5 photos.");
        break;
      }

      const preview = ["image/jpeg", "image/png", "image/webp"].includes(mime)
        ? URL.createObjectURL(file)
        : undefined;
      validFiles.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        file,
        preview,
      });
    }

    if (errors.length) {
      setPhotoError(errors.join(" "));
    } else {
      setPhotoError("");
    }

    const combinedPhotos = [...currentPhotos, ...validFiles];
    if (combinedPhotos.length > MAX_PHOTOS) {
      setPhotos(combinedPhotos.slice(0, MAX_PHOTOS));
    } else {
      setPhotos(combinedPhotos);
    }

    event.target.value = "";
  };

  const removePhoto = (id: string) => {
    const nextPhotos = photos.filter((photo) => photo.id !== id);
    const removedPhoto = photos.find((photo) => photo.id === id);
    if (removedPhoto?.preview) URL.revokeObjectURL(removedPhoto.preview);
    setPhotos(nextPhotos);
    setPhotoError("");
  };

  const resetPhotos = () => {
    revokePhotoPreviews(photos);
    setPhotos([]);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!data.getAll("services").length) {
      setServiceError(true);
      document.getElementById("service-options")?.focus();
      return;
    }

    setServiceError(false);
    setPhotoError("");
    setStatus("submitting");
    setSubmitMessage("");

    photos.forEach((photo) => data.append("photos[]", photo.file));

    try {
      const response = await fetch(`${basePath}/api/quote-submit.php`, {
        method: "POST",
        body: data,
        credentials: "same-origin",
      });

      type SubmitResult = {
        success?: boolean;
        message?: string;
      };

      const parsed = (await response.json().catch(() => ({
        success: false,
        message: "We couldn’t send your request. Please try again.",
      }))) as SubmitResult | unknown;
      const result =
        typeof parsed === "object" && parsed !== null
          ? (parsed as SubmitResult)
          : {
              success: false,
              message: "We couldn’t send your request. Please try again.",
            };

      if (!response.ok || !result.success) {
        setStatus("error");
        setSubmitMessage(
          result.message ||
            "We couldn’t send your request. Please try again or call 472-300-2290.",
        );
        return;
      }

      setStatus("success");
      setSubmitMessage("");
      resetPhotos();
      form.reset();
      setRequestStartedAt(Math.floor(Date.now() / 1000));
    } catch {
      setStatus("error");
      setSubmitMessage(
        "We couldn’t send your request. Please try again or call 472-300-2290.",
      );
    }
  };

  if (status === "success") {
    return (
      <section className="form-success" role="status">
        <p className="eyebrow">Request received</p>
        <h2>
          Thanks for
          <br />
          <em>reaching out.</em>
        </h2>
        <p>
          Your request has been received. Please allow 24–48 hours for us to
          review your project and follow up. Submission of a request does not
          confirm an appointment or final price.
        </p>
        <button
          className="text-link"
          type="button"
          onClick={() => setStatus("idle")}
        >
          Send another request
        </button>
      </section>
    );
  }

  return (
    <form
      className="quote-form"
      onSubmit={submit}
      aria-busy={status === "submitting"}
    >
      <input type="hidden" name="submission_time" value={requestStartedAt} />
      <div className="field field-wide honeypot-wrap" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="field">
        <label htmlFor="name">
          Name <span aria-hidden="true">*</span>
        </label>
        <input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="phone">
          Phone <span aria-hidden="true">*</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" required />
      </div>
      <div className="field field-wide">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" />
      </div>
      <div className="field field-wide">
        <label htmlFor="address">
          Property address / service location <span aria-hidden="true">*</span>
        </label>
        <input
          id="address"
          name="address"
          autoComplete="street-address"
          required
        />
      </div>
      <fieldset
        className="field-wide service-selector"
        aria-describedby={serviceError ? "service-error" : undefined}
      >
        <legend>
          Service needed <span aria-hidden="true">*</span>
          <small>Select all that apply</small>
        </legend>
        <div
          className="service-options"
          id="service-options"
          tabIndex={serviceError ? -1 : undefined}
        >
          {serviceFamilies
            .flatMap((family) => family.items)
            .map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  name="services"
                  value={item}
                  onChange={() => setServiceError(false)}
                />
                <span>{item}</span>
              </label>
            ))}
        </div>
        {serviceError && (
          <p className="field-error" id="service-error" role="alert">
            Select at least one service so we know what needs attention.
          </p>
        )}
      </fieldset>
      <div
        className="field-wide contact-method"
        role="group"
        aria-labelledby="contact-method-label"
      >
        <div id="contact-method-label" className="contact-method-label">
          Preferred contact method{" "}
          <span aria-hidden="true" className="required-asterisk">
            *
          </span>
        </div>
        <div className="contact-method-options">
          <label>
            <input type="radio" name="contact" value="phone" required />
            <span>Phone call</span>
          </label>
          <label>
            <input type="radio" name="contact" value="text" />
            <span>Text message</span>
          </label>
          <label>
            <input type="radio" name="contact" value="email" />
            <span>Email</span>
          </label>
        </div>
      </div>
      <div className="field field-wide">
        <label htmlFor="details">
          Project details <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="details"
          name="details"
          rows={7}
          required
          placeholder="Describe the property condition, approximate scope, specific problem, desired service, and any timing considerations."
        />
      </div>

      <div className="field field-wide photo-upload-section">
        <div className="photo-upload-header">
          <label htmlFor="photos" className="photo-upload-label">
            PROJECT PHOTOS — OPTIONAL
          </label>
          <p>
            Upload photos of the property, area, debris, damage, or work you
            would like completed.
          </p>
        </div>

        <label className="photo-upload-trigger" htmlFor="photos">
          <span aria-hidden="true">＋</span> Add photos
        </label>

        <input
          id="photos"
          ref={photoInputRef}
          type="file"
          name="photos[]"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          onChange={handlePhotoChange}
        />

        <p className="photo-upload-meta">
          Up to 5 photos · Maximum 10 MB each
          <br />
          JPG, JPEG, PNG, HEIC, HEIF, or WEBP
        </p>

        {photoError && (
          <p className="field-error" role="alert">
            {photoError}
          </p>
        )}

        {photos.length > 0 && (
          <ul className="photo-list" aria-live="polite">
            {photos.map((photo) => (
              <li key={photo.id} className="photo-item">
                <div className="photo-preview-wrap">
                  {photo.preview ? (
                    <img
                      src={photo.preview}
                      alt={photo.file.name}
                      className="photo-preview"
                    />
                  ) : (
                    <span
                      className="photo-file-indicator"
                      aria-label="Photo file"
                    >
                      IMG
                    </span>
                  )}
                </div>
                <div className="photo-info">
                  <strong>{photo.file.name}</strong>
                  <small>{formatFileSize(photo.file.size)}</small>
                </div>
                <button
                  type="button"
                  className="photo-remove"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={`Remove ${photo.file.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="photo-upload-note">
          Need to send more? Email additional photos to{" "}
          <a href="mailto:cavalrygreenllc@gmail.com">
            cavalrygreenllc@gmail.com
          </a>
        </p>
      </div>

      {status === "error" && (
        <p className="form-error" role="alert">
          {submitMessage ||
            "We couldn’t send your request. Please try again or call 472-300-2290."}
        </p>
      )}

      <div className="form-submit field-wide">
        <button
          className="button button-olive"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending request…" : "Request a quote"}
          <span aria-hidden="true">→</span>
        </button>
        <p>Submitting a request does not confirm an appointment or price.</p>
      </div>
    </form>
  );
}
