import { AttachmentPicker } from '../components/AttachmentPicker';
import type { ProjectRequestFormApi } from '../state/useProjectRequestForm';

export function StepAttachments({ form }: { form: ProjectRequestFormApi }) {
  const { draft, addAttachments, removeAttachment } = form;

  return (
    <AttachmentPicker
      attachments={draft.attachments}
      onAdd={addAttachments}
      onRemove={removeAttachment}
    />
  );
}
