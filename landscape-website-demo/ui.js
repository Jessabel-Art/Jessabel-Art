import {withBase} from './config.js';
export const escapeHTML = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const logo = `<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 36 40" fill="none"><path d="M18 36V5M18 25C7 26 3 20 3 11c10-1 15 4 15 14ZM18 19C28 20 33 14 33 5c-10-1-15 5-15 14Z" stroke="currentColor" stroke-width="1.7"/><path d="M9 35h18" stroke="currentColor" stroke-width="1.7"/></svg></span><span>Alder <i>&amp;</i> Field<small>Landscape &amp; Lawn</small></span>`;
// type: '' (primary, solid), 'light' (solid, for dark sections), 'ghost'
// (text + animated underline, no border box — the outline-box style this
// replaces read as a generic template default).
export const button = (text, href, type = '') => `<a class="button ${type}" href="${href}">${text}<span class="button-arrow" aria-hidden="true"></span></a>`;
// A short plain-text label used only where it carries real information (a
// product's material category, a status). Not a decorative section kicker —
// styled as ordinary small text, no uppercase/letter-spacing treatment.
export const label = text => `<p class="label">${text}</p>`;
export const photo = (name,alt,cls = '',eager = false) => `<img class="${cls}" src="${withBase(`/assets/${name}.webp`)}" srcset="${withBase(`/assets/${name}-small.webp`)} 480w, ${withBase(`/assets/${name}.webp`)} 1200w" sizes="(max-width:560px) calc(100vw - 40px), (max-width:800px) 50vw, 45vw" alt="${alt}" width="1536" height="1024" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
export function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 3200); }
export function openDialog(html) { const dialog = document.querySelector('#detail-dialog'); dialog.innerHTML = `<button class="dialog-close icon-button" aria-label="Close dialog">×</button>${html}`; dialog.querySelector('.dialog-close').onclick = () => dialog.close(); dialog.onclick = e => { if(e.target === dialog && (e.clientX < dialog.getBoundingClientRect().left || e.clientX > dialog.getBoundingClientRect().right || e.clientY < dialog.getBoundingClientRect().top || e.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); }; dialog.showModal(); return dialog; }
