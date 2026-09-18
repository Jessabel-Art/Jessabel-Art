import { useRef, useState } from 'react';
import { FormStatus } from '@/components/forms/FormStatus';
import {
  ACCEPTED_ATTACHMENT_SUMMARY,
  ACCEPTED_ATTACHMENT_TYPES,
  MAX_ATTACHMENTS,
  attachmentCategoryOptions,
} from '@/data/proposal-options';
import type { AttachmentCategory, ProjectAttachment } from '@/types/project-request';
import { formatFileSize, formatFileType } from '@/utils/format';
import { createLocalId } from '@/utils/id';
import './AttachmentPicker.css';

interface AttachmentPickerProps {
  attachments: readonly ProjectAttachment[];
  onAdd: (attachments: ProjectAttachment[]) => void;
  onRemove: (id: string) => void;
}

/* -----------------------------------------------------------------------------
   File selection is held in browser memory only.

   Nothing is uploaded, and no request is made. The selected `File` objects are
   kept in form state so that the list can be displayed and edited. When an
   upload service is added later, this component is the only place that needs to
   start sending them.
   -------------------------------------------------------------------------- */

export function AttachmentPicker({ attachments, onAdd, onRemove }: AttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<AttachmentCategory>('property-photos');
  const [notice, setNotice] = useState<string | null>(null);

  const remaining = MAX_ATTACHMENTS - attachments.length;
  const activeCategory = attachmentCategoryOptions.find((option) => option.id === category);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    const accepted = incoming.slice(0, Math.max(0, remaining));
    const rejectedCount = incoming.length - accepted.length;

    const next: ProjectAttachment[] = accepted.map((file) => ({
      id: createLocalId('file'),
      name: file.name,
      type: file.type,
      size: file.size,
      category,
      file,
    }));

    if (next.length > 0) onAdd(next);

    setNotice(
      rejectedCount > 0
        ? `${next.length} file${next.length === 1 ? '' : 's'} added. ${rejectedCount} not added — the limit is ${MAX_ATTACHMENTS} files.`
        : `${next.length} file${next.length === 1 ? '' : 's'} added to this request.`,
    );

    // Reset the input so selecting the same file again still fires a change.
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="attachments">
      <FormStatus tone="info" title="Files stay in your browser">
        <p>
          This form does not upload anything. Selected files are listed here so you can
          review them, and are cleared when you leave the page. File transfer will be added
          alongside the proposal system.
        </p>
      </FormStatus>

      <div className="attachments__controls">
        <div className="field">
          <label className="field__label" htmlFor="attachment-category">
            What are you adding?
          </label>
          <p className="field__hint" id="attachment-category-hint">
            {activeCategory
              ? activeCategory.description
              : 'Labelling files makes them far more useful when the project is scoped.'}
          </p>
          <div className="select-wrap">
            <select
              id="attachment-category"
              className="input select"
              value={category}
              aria-describedby="attachment-category-hint"
              onChange={(event) => setCategory(event.target.value as AttachmentCategory)}
            >
              {attachmentCategoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="select-wrap__chevron" aria-hidden="true">
              &#9662;
            </span>
          </div>
        </div>

        <div className="attachments__picker">
          <label className="field__label" htmlFor="attachment-input">
            Select files
          </label>
          <p className="field__hint" id="attachment-input-hint">
            {ACCEPTED_ATTACHMENT_SUMMARY}. {remaining} slot{remaining === 1 ? '' : 's'}{' '}
            remaining.
          </p>
          <input
            ref={inputRef}
            id="attachment-input"
            className="attachments__input"
            type="file"
            multiple
            accept={ACCEPTED_ATTACHMENT_TYPES}
            aria-describedby="attachment-input-hint"
            disabled={remaining <= 0}
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
      </div>

      <p className="attachments__live" role="status" aria-live="polite">
        {notice}
      </p>

      {attachments.length > 0 ? (
        <div className="attachments__list-wrap">
          <h3 className="attachments__heading">
            Selected files ({attachments.length}/{MAX_ATTACHMENTS})
          </h3>
          <ul className="attachments__list">
            {attachments.map((attachment) => {
              const label =
                attachmentCategoryOptions.find((option) => option.id === attachment.category)
                  ?.label ?? 'File';
              return (
                <li key={attachment.id} className="attachment">
                  <span className="attachment__type" aria-hidden="true">
                    {formatFileType(attachment.type, attachment.name)}
                  </span>
                  <span className="attachment__meta">
                    <span className="attachment__name">{attachment.name}</span>
                    <span className="attachment__detail">
                      {label} · {formatFileType(attachment.type, attachment.name)} ·{' '}
                      {formatFileSize(attachment.size)}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="attachment__remove"
                    onClick={() => {
                      onRemove(attachment.id);
                      setNotice(`Removed ${attachment.name}.`);
                    }}
                  >
                    <span aria-hidden="true">Remove</span>
                    <span className="visually-hidden">Remove {attachment.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="attachments__empty">
          No files selected. This step is optional — you can continue without adding
          anything.
        </p>
      )}
    </div>
  );
}
