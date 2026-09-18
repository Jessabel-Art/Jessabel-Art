import { useState } from 'react';
import { constructionProcess } from '@/data/content';
import './ProcessSequence.css';

/**
 * The construction process as one connected sequence rather than a grid of
 * equal cards. On mobile every phase stays visible so nothing requires
 * hovering. At desktop width, the track stays compact and only the selected
 * phase's explanation shows below it — the line itself communicates order,
 * so the phases don't need numbering.
 */
export function ProcessSequence() {
  const [activeId, setActiveId] = useState(constructionProcess[0]?.id);
  const active =
    constructionProcess.find((step) => step.id === activeId) ?? constructionProcess[0];

  return (
    <div className="process-seq">
      <ol className="process-seq__track">
        {constructionProcess.map((step) => {
          const isActive = step.id === activeId;
          return (
            <li key={step.id} className={isActive ? 'is-active' : ''}>
              <button
                type="button"
                onMouseEnter={() => setActiveId(step.id)}
                onFocus={() => setActiveId(step.id)}
                onClick={() => setActiveId(step.id)}
                aria-expanded={isActive}
              >
                <span className="process-seq__dot" aria-hidden="true" />
                <span className="process-seq__name">{step.title}</span>
              </button>
              <p className="process-seq__desc">{step.description}</p>
            </li>
          );
        })}
      </ol>

      {active ? <p className="process-seq__panel">{active.description}</p> : null}
    </div>
  );
}
