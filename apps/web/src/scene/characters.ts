/* TAPETAUPE characters
 * Standard mole (Phase 1.4 — only the mascot used on the home screen).
 * Other variants (golden, speedy, bomb) come in Phase 3 when gameplay needs them.
 *
 * Anatomy (per DESIGN.md):
 *  - pear-shaped body, lighter belly
 *  - sleepy half-closed eyes (heavy upper lids)
 *  - pointed pink snout sticking forward
 *  - big goofy open smile, tongue, 2 prominent upper incisors
 *  - tiny clawed front paws
 *  - thick petrol outline (3-4px)
 */

const PETROL = 'var(--color-petrol)';
const MOLE = 'var(--color-mole)';
const MOLE_BELLY = 'var(--color-mole-belly)';
const SNOUT = '#f2a4a4';
const TONGUE = '#e07b7b';
const TONGUE_HIGHLIGHT = '#ffb5b5';
const TEETH = '#ffffff';
const MOUTH_DARK = '#1b3f54';

function paw(x: number, flip: boolean): string {
  const sx = flip ? -1 : 1;
  return `
    <g transform="translate(${x} 70) scale(${sx} 1)">
      <ellipse cx="0" cy="0" rx="6.5" ry="5" fill="${MOLE}" stroke="${PETROL}" stroke-width="2.8" stroke-linejoin="round" />
      <path d="M -4 4 L -5 7 M -1 5 L -1 8 M 2 5 L 3 7.5"
            stroke="${PETROL}" stroke-width="2" stroke-linecap="round" fill="none" />
    </g>
  `;
}

function sleepyEyes(): string {
  const cx1 = 38;
  const cx2 = 62;
  const cy = 36;
  return `
    <g stroke="${PETROL}" stroke-width="3" stroke-linecap="round" fill="none">
      <path d="M ${cx1 - 5} ${cy} Q ${cx1} ${cy + 3} ${cx1 + 5} ${cy}" />
      <path d="M ${cx2 - 5} ${cy} Q ${cx2} ${cy + 3} ${cx2 + 5} ${cy}" />
      <circle cx="${cx1}" cy="${cy + 1.5}" r="1.2" fill="${PETROL}" stroke="none" />
      <circle cx="${cx2}" cy="${cy + 1.5}" r="1.2" fill="${PETROL}" stroke="none" />
    </g>
  `;
}

function moleSnout(): string {
  const cx = 50;
  const cy = 48;
  return `
    <g>
      <path d="M ${cx - 8} ${cy} Q ${cx - 9} ${cy + 6}, ${cx - 4} ${cy + 9} L ${cx + 4} ${cy + 9} Q ${cx + 9} ${cy + 6}, ${cx + 8} ${cy} Q ${cx + 6} ${cy - 3}, ${cx} ${cy - 3.5} Q ${cx - 6} ${cy - 3}, ${cx - 8} ${cy} Z"
            fill="${SNOUT}" stroke="${PETROL}" stroke-width="3" stroke-linejoin="round" />
      <ellipse cx="${cx - 3}" cy="${cy + 1}" rx="3" ry="1.6" fill="#ffffff" opacity="0.7" transform="rotate(-15 ${cx - 3} ${cy + 1})" />
      <ellipse cx="${cx}" cy="${cy + 5.5}" rx="2.2" ry="1.8" fill="${PETROL}" />
      <circle cx="${cx - 0.6}" cy="${cy + 5}" r="0.6" fill="#ffffff" opacity="0.8" />
    </g>
  `;
}

function goofySmile(): string {
  const cx = 50;
  const cy = 66;
  const w = 13;
  return `
    <g>
      <path d="M ${cx - w} ${cy} Q ${cx - w} ${cy + 9}, ${cx} ${cy + 10} Q ${cx + w} ${cy + 9}, ${cx + w} ${cy} Q ${cx} ${cy - 1}, ${cx - w} ${cy} Z"
            fill="${MOUTH_DARK}" stroke="${PETROL}" stroke-width="3" stroke-linejoin="round" />
      <ellipse cx="${cx + 1}" cy="${cy + 7}" rx="${(w * 0.55).toFixed(2)}" ry="3" fill="${TONGUE}" />
      <ellipse cx="${cx - 0.5}" cy="${cy + 6.5}" rx="${(w * 0.3).toFixed(2)}" ry="1.5" fill="${TONGUE_HIGHLIGHT}" opacity="0.7" />
      <rect x="${cx - 4.5}" y="${cy - 0.5}" width="3.5" height="5.5" rx="0.8" fill="${TEETH}" stroke="${PETROL}" stroke-width="1.4" />
      <rect x="${cx + 1}" y="${cy - 0.5}" width="3.5" height="5.5" rx="0.8" fill="${TEETH}" stroke="${PETROL}" stroke-width="1.4" />
    </g>
  `;
}

function moleBody(): string {
  return `
    <g>
      <ellipse cx="50" cy="93" rx="32" ry="4.5" fill="${PETROL}" opacity="0.18" />
      <path d="M 50 12 C 28 12, 16 32, 16 56 C 16 78, 30 90, 50 90 C 70 90, 84 78, 84 56 C 84 32, 72 12, 50 12 Z"
            fill="${MOLE}" stroke="${PETROL}" stroke-width="4" stroke-linejoin="round" />
      <ellipse cx="50" cy="68" rx="22" ry="18" fill="${MOLE_BELLY}" />
      <ellipse cx="34" cy="30" rx="11" ry="7" fill="#ffffff" opacity="0.4" transform="rotate(-30 34 30)" />
      ${paw(26, false)}
      ${paw(74, true)}
    </g>
  `;
}

export function renderStandardMole(size = 140): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'mole mole--standard';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.width = `${size}px`;
  wrapper.style.height = `${size}px`;
  wrapper.innerHTML = `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      ${moleBody()}
      ${sleepyEyes()}
      ${moleSnout()}
      ${goofySmile()}
    </svg>
  `;
  return wrapper;
}
