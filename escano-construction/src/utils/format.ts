/** Human-readable file size, e.g. "1.4 MB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/** Short, readable file type label derived from a MIME type or filename. */
export function formatFileType(type: string, name: string): string {
  if (type === 'application/pdf') return 'PDF';
  if (type.startsWith('image/')) return type.replace('image/', '').toUpperCase();
  const ext = name.includes('.') ? name.split('.').pop() : '';
  return ext ? ext.toUpperCase() : 'File';
}

/** Comma-separated list, or a fallback when nothing was selected. */
export function formatList(values: readonly string[], fallback = 'Not provided'): string {
  return values.length > 0 ? values.join(', ') : fallback;
}

/** Trims and collapses whitespace, returning a fallback for empty input. */
export function orFallback(value: string, fallback = 'Not provided'): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

/** Locale date/time string used in the simulated submission receipt. */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}
