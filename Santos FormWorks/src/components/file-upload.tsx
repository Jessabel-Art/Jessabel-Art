"use client";
import { useRef, useState } from "react";
import { Icon } from "./icon";
const extensions = [
  "stl",
  "obj",
  "step",
  "stp",
  "iges",
  "igs",
  "3mf",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "pdf",
];
export function FileUpload({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const add = (incoming: FileList | File[]) => {
    const next = [...files];
    const errors: string[] = [];
    Array.from(incoming).forEach((file) => {
      if (
        !extensions.includes(file.name.split(".").pop()?.toLowerCase() ?? "")
      ) {
        errors.push(`${file.name}: unsupported format.`);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        errors.push(`${file.name}: exceeds 50 MB.`);
        return;
      }
      if (next.length >= 10) {
        errors.push("You can select up to 10 files.");
        return;
      }
      if (!next.some((f) => f.name === file.name && f.size === file.size))
        next.push(file);
    });
    onChange(next);
    setErrors([...new Set(errors)]);
  };
  return (
    <>
      <div
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
      >
        <Icon name="upload" size={34} />
        <p>Drag & drop your files here</p>
        <span className="small muted">or select them from your device</span>
        <button
          type="button"
          className="button button-outline"
          onClick={() => input.current?.click()}
        >
          Choose files <Icon name="plus" size={16} />
        </button>
        <input
          className="sr-only"
          tabIndex={-1}
          ref={input}
          type="file"
          multiple
          accept={extensions.map((x) => "." + x).join(",")}
          aria-label="Choose reference files"
          aria-describedby="file-help"
          onChange={(e) => {
            if (e.target.files) add(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      <p className="field-help" id="file-help">
        STL, OBJ, STEP, IGES, 3MF, JPG, PNG, WEBP, PDF
        <br />
        Up to 50 MB per file · Maximum 10 files · Stored only in this preview
      </p>
      {errors.length > 0 && (
        <div className="field-error" role="alert">
          {errors.map((x) => (
            <p key={x}>{x}</p>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <ul className="file-list" aria-label="Selected files">
          {files.map((file, i) => (
            <li key={`${file.name}-${file.size}`}>
              <Icon name="file" size={18} />
              <span>
                {file.name}
                <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
              </span>
              <button
                type="button"
                className="icon-button"
                aria-label={`Remove ${file.name}`}
                onClick={() =>
                  onChange(files.filter((_, index) => index !== i))
                }
              >
                <Icon name="close" size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
