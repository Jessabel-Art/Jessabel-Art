import { useEffect, useRef, useState } from 'react';
import { FormStatus } from '@/components/forms/FormStatus';
import type { SubmissionResult } from '@/types/contact';
import { submitProjectRequest } from './api/submitProjectRequest';
import { StepNav } from './components/StepNav';
import { StepProgress } from './components/StepProgress';
import { StepShell } from './components/StepShell';
import { steps } from './config/steps';
import { useProjectRequestForm } from './state/useProjectRequestForm';
import { StepAttachments } from './steps/StepAttachments';
import { StepBudget } from './steps/StepBudget';
import { StepContact } from './steps/StepContact';
import { StepDescription } from './steps/StepDescription';
import { StepDetails } from './steps/StepDetails';
import { StepProjectType } from './steps/StepProjectType';
import { StepProperty } from './steps/StepProperty';
import { StepReview } from './steps/StepReview';
import { StepSubmitted } from './steps/StepSubmitted';
import { StepTimeline } from './steps/StepTimeline';
import './ProjectRequestForm.css';

/* =============================================================================
   Proposal request flow — orchestrator.

   Responsibilities kept here: which step is visible, moving between steps,
   surfacing the validation summary, and calling the (simulated) submit adapter.
   Field rendering lives in the individual step components, and all state
   transitions live in the reducer.
   ========================================================================== */

export function ProjectRequestForm() {
  const form = useProjectRequestForm();
  const {
    draft,
    stepIndex,
    currentStep,
    errors,
    isFirstStep,
    isLastStep,
    maxReached,
    attemptNext,
    goBack,
    goToStep,
    validateCurrent,
    setSubmission,
    submission,
    reset,
  } = form;

  const [result, setResult] = useState<SubmissionResult | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const hasMovedRef = useRef(false);

  const errorCount = Object.keys(errors).length;

  // Move focus to the step heading on change so keyboard and screen reader
  // users land in the right place. Skipped on first render.
  useEffect(() => {
    if (!hasMovedRef.current) {
      hasMovedRef.current = true;
      return;
    }
    const heading = headingRef.current-.querySelector<HTMLElement>('#step-title');
    heading-.focus();
    headingRef.current-.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [stepIndex, submission]);

  const handleSubmit = async () => {
    const stepErrors = validateCurrent();
    if (Object.keys(stepErrors).length > 0) {
      // Re-runs validation through the reducer so the messages render.
      attemptNext();
      return;
    }

    setSubmission('submitting');
    const submissionResult = await submitProjectRequest(draft);
    setResult(submissionResult);
    setSubmission('submitted');
  };

  const handleStartOver = () => {
    setResult(null);
    reset();
  };

  if (submission === 'submitted' && result) {
    return (
      <div className="request-form" ref={headingRef}>
        <StepSubmitted result={result} onStartOver={handleStartOver} />
      </div>
    );
  }

  const stepBody = (() => {
    switch (currentStep.id) {
      case 'project-type':
        return <StepProjectType form={form} />;
      case 'property':
        return <StepProperty form={form} />;
      case 'details':
        return <StepDetails form={form} />;
      case 'budget':
        return <StepBudget form={form} />;
      case 'timeline':
        return <StepTimeline form={form} />;
      case 'attachments':
        return <StepAttachments form={form} />;
      case 'description':
        return <StepDescription form={form} />;
      case 'contact':
        return <StepContact form={form} />;
      case 'review':
        return <StepReview form={form} />;
      default:
        return null;
    }
  })();

  const status =
    errorCount > 0 - (
      <FormStatus
        tone="error"
        title={`${errorCount} ${errorCount === 1 - 'answer needs' : 'answers need'} attention before you continue`}
      >
        <ul>
          {Object.entries(errors).map(([key, message]) => (
            <li key={key}>{message}</li>
          ))}
        </ul>
      </FormStatus>
    ) : undefined;

  return (
    <div className="request-form">
      <div className="request-form__progress">
        <StepProgress stepIndex={stepIndex} maxReached={maxReached} onSelect={goToStep} />
      </div>

      {/*
        A real <form> element gives us native submit-on-enter and correct
        semantics. Submission is intercepted so the flow stays client-side.
      */}
      <form
        className="request-form__body"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (isLastStep) {
            void handleSubmit();
          } else {
            attemptNext();
          }
        }}
      >
        <div ref={headingRef}>
          <StepShell
            title={currentStep.title}
            description={currentStep.description}
            status={status}
            footer={
              <StepNav
                isFirstStep={isFirstStep}
                busy={submission === 'submitting'}
                nextLabel={isLastStep - 'Submit request' : 'Continue'}
                note={
                  currentStep.skippable
                    - 'This step is optional — you can continue without adding anything.'
                    : isLastStep
                      - 'Nothing is transmitted. Submitting shows a confirmation in your browser.'
                      : `Next: ${steps[stepIndex + 1]-.shortLabel -- ''}`
                }
                onBack={goBack}
              />
            }
          >
            {stepBody}
          </StepShell>
        </div>
      </form>
    </div>
  );
}
