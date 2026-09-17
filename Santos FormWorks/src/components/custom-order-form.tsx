"use client";
import { useState, type ReactNode } from "react";
import { FileUpload } from "./file-upload";
import { Icon } from "./icon";
import { Button } from "./ui";
type RequestPreview = {
  project: string;
  description: string;
  material: string;
  color: string;
  quantity: string;
  files: string[];
};
function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="form-section">
      <legend>
        <span className="step-number">{number}</span>
        <span>
          {title}
          <small>{description}</small>
        </span>
      </legend>
      <div className="form-section-content">{children}</div>
    </fieldset>
  );
}
export function FormField({
  label,
  htmlFor,
  children,
  required = false,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      {children}
    </div>
  );
}
export function CustomOrderForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<RequestPreview | null>(null);
  return (
    <form
      className="custom-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setPreview({
          project: String(data.get("project") || "Untitled project"),
          description: String(data.get("description")),
          material: String(data.get("material")),
          color: String(data.get("color")),
          quantity: String(data.get("quantity")),
          files: files.map((f) => f.name),
        });
        window.setTimeout(
          () => document.getElementById("request-preview")?.focus(),
          0,
        );
      }}
    >
      <FormSection
        number={1}
        title="Project details"
        description="Tell us about the idea you can’t stop thinking about."
      >
        <FormField label="Project name (optional)" htmlFor="project">
          <input
            id="project"
            name="project"
            maxLength={120}
            placeholder="e.g. A custom controller stand"
          />
        </FormField>
        <FormField
          label="Tell us about your idea"
          htmlFor="description"
          required
        >
          <textarea
            id="description"
            name="description"
            required
            minLength={10}
            maxLength={5000}
            rows={4}
            placeholder="What are we making? Tell us about its purpose, size, style, and any details that matter."
          />
        </FormField>
      </FormSection>
      <FormSection
        number={2}
        title="Upload files"
        description="A 3D model, a sketch, a reference photo. Start with what you have."
      >
        <FileUpload files={files} onChange={setFiles} />
      </FormSection>
      <FormSection
        number={3}
        title="Print preferences"
        description="A few details to help us find the right fit."
      >
        <div className="form-grid three">
          <FormField label="Material" htmlFor="material">
            <select name="material" id="material">
              <option>PLA (Most popular)</option>
              <option>PETG</option>
              <option>ABS</option>
              <option>TPU (Flexible)</option>
              <option>ASA</option>
              <option>Help me choose</option>
            </select>
          </FormField>
          <FormField label="Color" htmlFor="color">
            <select name="color" id="color">
              <option>Black</option>
              <option>Red</option>
              <option>Gray</option>
              <option>White</option>
              <option>Blue</option>
              <option>Green</option>
              <option>Other / Not sure</option>
            </select>
          </FormField>
          <FormField label="Quantity" htmlFor="quantity">
            <input
              name="quantity"
              id="quantity"
              type="number"
              min={1}
              max={1000}
              step={1}
              defaultValue={1}
              required
            />
          </FormField>
        </div>
        <div className="form-grid">
          <FormField label="Dimensions, if known" htmlFor="dimensions">
            <input
              name="dimensions"
              id="dimensions"
              maxLength={100}
              placeholder="e.g. 100 × 50 × 50 mm"
            />
          </FormField>
          <FormField label="Surface finish" htmlFor="finish">
            <select name="finish" id="finish">
              <option>Standard (layer lines visible)</option>
              <option>Smooth / post-processed</option>
              <option>Help me choose</option>
            </select>
          </FormField>
        </div>
      </FormSection>
      <FormSection
        number={4}
        title="Additional information"
        description="Anything else we should know?"
      >
        <FormField label="Special requests (optional)" htmlFor="requests">
          <textarea
            id="requests"
            name="requests"
            rows={3}
            maxLength={3000}
            placeholder="Fit requirements, personalization, or other details…"
          />
        </FormField>
        <div className="form-grid">
          <FormField label="Preferred deadline (optional)" htmlFor="deadline">
            <input id="deadline" name="deadline" type="date" />
            <span className="field-help">
              Timing is confirmed after review.
            </span>
          </FormField>
          <FormField label="Delivery preference" htmlFor="delivery">
            <select name="delivery" id="delivery">
              <option>Local pickup · Jacksonville, FL</option>
              <option>Shipping</option>
              <option>Decide later</option>
            </select>
          </FormField>
        </div>
        <FormField label="Notes (optional)" htmlFor="notes">
          <textarea
            id="notes"
            name="notes"
            rows={2}
            maxLength={3000}
            placeholder="Questions or anything you’d like to add"
          />
        </FormField>
      </FormSection>
      <div className="form-submit">
        <Button type="submit" className="w-full">
          <Icon name="arrow" size={18} />
          Submit request
        </Button>
        <p>
          This preview prepares your request locally. No files or details are
          sent.
        </p>
        <span className="small muted">
          A custom request starts with a review and quote — never an automatic
          payment.
        </span>
      </div>
      {preview && (
        <section
          id="request-preview"
          tabIndex={-1}
          className="request-preview"
          role="status"
        >
          <Icon name="check" size={30} />
          <h2>Your request preview is ready.</h2>
          <p>
            Nothing has been submitted. Production requests and file storage
            will be available in a future release.
          </p>
          <dl>
            <div>
              <dt>Project</dt>
              <dd>{preview.project}</dd>
            </div>
            <div>
              <dt>Print</dt>
              <dd>
                {preview.quantity} × {preview.material} · {preview.color}
              </dd>
            </div>
            <div>
              <dt>Files selected</dt>
              <dd>
                {preview.files.length
                  ? preview.files.join(", ")
                  : "No files selected"}
              </dd>
            </div>
          </dl>
          <p className="small">
            When ordering launches: review → quote → your approval → payment →
            production → pickup or shipping.
          </p>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setPreview(null);
              document.getElementById("project")?.focus();
            }}
          >
            Continue editing <Icon name="arrow" size={16} />
          </button>
        </section>
      )}
    </form>
  );
}
