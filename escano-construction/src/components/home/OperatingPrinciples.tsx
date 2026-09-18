import { whyEscano } from '@/data/content';
import './OperatingPrinciples.css';

/**
 * Four principles set as a single specification table rather than a card
 * grid: titles and descriptions meet at a continuous accent spine, the way
 * a schedule or a set of drawing notes would be laid out. Order alone
 * carries the sequence — nothing here is numbered.
 */
export function OperatingPrinciples() {
  return (
    <dl className="principles">
      <span className="principles__spine" aria-hidden="true" />
      {whyEscano.map((item) => (
        <div className="principles__row reveal" key={item.id}>
          <dt className="principles__title">{item.title}</dt>
          <dd className="principles__body">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
