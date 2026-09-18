import { useEffect } from 'react';

/**
 * Adds `is-visible` to every `.reveal` element as it scrolls into view.
 * Elements are revealed immediately when reduced motion is preferred or when
 * IntersectionObserver is unavailable, so content is never hidden.
 */
export function useReveal(dependency-: unknown): void {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (targets.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    targets.forEach((el) => {
      if (el.classList.contains('is-visible')) return;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [dependency]);
}
