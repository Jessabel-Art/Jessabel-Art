import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';
import type { SubmissionResult } from '@/types/contact';
import { formatTimestamp } from '@/utils/format';
import './StepSubmitted.css';

interface StepSubmittedProps {
  result: SubmissionResult;
  onStartOver: () => void;
}

export function StepSubmitted({ result, onStartOver }: StepSubmittedProps) {
  return (
    <div className="submitted">
      <span className="submitted__status">Complete</span>
      <h2 className="submitted__title">Request received</h2>

      <p className="submitted__lede">
        Every step validated successfully and your answers were assembled into a complete
        project request. {result.message}
      </p>

      <dl className="submitted__meta">
        <div>
          <dt>Reference</dt>
          <dd>{result.reference}</dd>
        </div>
        <div>
          <dt>Submitted</dt>
          <dd>{formatTimestamp(result.submittedAt)}</dd>
        </div>
      </dl>

      <div className="submitted__actions">
        <Button onClick={onStartOver} variant="secondary">
          Start a new request
        </Button>
        <Button to={routes.projects} withArrow>
          View project concepts
        </Button>
      </div>
    </div>
  );
}
