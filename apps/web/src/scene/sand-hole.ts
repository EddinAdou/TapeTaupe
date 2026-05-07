/* TAPETAUPE — sand hole (terrier)
 * Concentric ellipses giving depth: drop shadow, outer rim, interior, inner shadow, deepest center.
 * Used on the home (mascot emerging) and on the game board (one per cell).
 */

const PETROL = 'var(--color-petrol)';
const SAND_DARK = 'var(--color-sand-dark)';
const SAND_SHADOW = 'var(--color-sand-shadow)';
const COCONUT = 'var(--color-coconut)';

export function renderSandHole(width = 220, height = 100): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'sand-hole';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;
  wrapper.innerHTML = `
    <svg viewBox="0 0 100 80" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <ellipse cx="50" cy="68" rx="44" ry="6" fill="${PETROL}" opacity="0.15" />
      <ellipse cx="50" cy="50" rx="44" ry="20" fill="${SAND_DARK}" stroke="${COCONUT}" stroke-width="2.5" />
      <ellipse cx="50" cy="50" rx="34" ry="14" fill="${SAND_SHADOW}" />
      <path d="M 18 50 Q 50 70, 82 50" fill="${COCONUT}" opacity="0.65" />
      <ellipse cx="50" cy="52" rx="26" ry="8" fill="#7a5520" />
    </svg>
  `;
  return wrapper;
}
