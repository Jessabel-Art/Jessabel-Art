import type { ReactNode } from 'react';
import './ReviewSection.css';

export interface ReviewItem {
  readonly label: string;
  readonly value: ReactNode;
}

interface ReviewSectionProps {
  id: string;
  title: string;
  items: readonly ReviewItem[];
  /** Jumps back to the step that owns this section. */
  onEdit: () => void;
  editLabel: string;
}

/**
 * One block of the review summary. Editing returns the customer to the relevant
 * step; nothing entered anywhere in the form is discarded.
 */
export function ReviewSection({ id, title, items, onEdit, editLabel }: ReviewSectionProps) {
  return (
    <section className="review-section" aria-labelledby={`review-${id}`}>
      <header className="review-section__head">
        <h3 className="review-section__title" id={`review-${id}`}>
          {title}
        </h3>
        <button type="button" className="review-section__edit" onClick={onEdit}>
          <span aria-hidden="true">Edit</span>
          <span className="visually-hidden">{editLabel}</span>
        </button>
      </header>

      <dl className="review-section__list">
        {items.map((item) => (
          <div className="review-row" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
