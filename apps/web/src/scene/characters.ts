const PETROL = 'var(--color-petrol)';
const MOLE = 'var(--color-mole)';
const MOLE_BELLY = 'var(--color-mole-belly)';
const TREASURE = 'var(--color-treasure)';
const SPEED = 'var(--color-speed)';
const BOMB_BODY = 'var(--color-bomb)';

const SNOUT = '#f2a4a4';
const SNOUT_GOLD = '#f8c8a0';
const SNOUT_SPEEDY = '#f8b5b5';
const TONGUE = '#e07b7b';
const TONGUE_HIGHLIGHT = '#ffb5b5';
const TEETH = '#ffffff';
const MOUTH_DARK = '#1b3f54';
const HAT_BROWN = '#5c3a20';
const HAT_BROWN_DARK = '#3d2511';
const GOGGLE_LEATHER = '#7a4a28';
const GOGGLE_GLASS = '#f5e8c8';
const SCARF = '#faf1dd';
const GOLDEN_BELLY = '#ffd970';
const SPEEDY_BELLY = '#e89090';
const BOMB_DARK = '#1f1f1f';
const BOMB_BELLY_SHADOW = '#5a5a5a';

function paw(x: number, flip: boolean, bodyColor: string): string {
  const sx = flip ? -1 : 1;
  return `
    <g transform="translate(${x} 70) scale(${sx} 1)">
      <ellipse cx="0" cy="0" rx="6.5" ry="5" fill="${bodyColor}" stroke="${PETROL}" stroke-width="2.8" stroke-linejoin="round" />
      <path d="M -4 4 L -5 7 M -1 5 L -1 8 M 2 5 L 3 7.5"
            stroke="${PETROL}" stroke-width="2" stroke-linecap="round" fill="none" />
    </g>
  `;
}

function sleepyEyes(cy: number): string {
  const cx1 = 38;
  const cx2 = 62;
  return `
    <g stroke="${PETROL}" stroke-width="3" stroke-linecap="round" fill="none">
      <path d="M ${cx1 - 5} ${cy} Q ${cx1} ${cy + 3} ${cx1 + 5} ${cy}" />
      <path d="M ${cx2 - 5} ${cy} Q ${cx2} ${cy + 3} ${cx2 + 5} ${cy}" />
      <circle cx="${cx1}" cy="${cy + 1.5}" r="1.2" fill="${PETROL}" stroke="none" />
      <circle cx="${cx2}" cy="${cy + 1.5}" r="1.2" fill="${PETROL}" stroke="none" />
    </g>
  `;
}

function moleSnout(cx: number, cy: number, color: string): string {
  return `
    <g>
      <path d="M ${cx - 8} ${cy} Q ${cx - 9} ${cy + 6}, ${cx - 4} ${cy + 9} L ${cx + 4} ${cy + 9} Q ${cx + 9} ${cy + 6}, ${cx + 8} ${cy} Q ${cx + 6} ${cy - 3}, ${cx} ${cy - 3.5} Q ${cx - 6} ${cy - 3}, ${cx - 8} ${cy} Z"
            fill="${color}" stroke="${PETROL}" stroke-width="3" stroke-linejoin="round" />
      <ellipse cx="${cx - 3}" cy="${cy + 1}" rx="3" ry="1.6" fill="#ffffff" opacity="0.7" transform="rotate(-15 ${cx - 3} ${cy + 1})" />
      <ellipse cx="${cx}" cy="${cy + 5.5}" rx="2.2" ry="1.8" fill="${PETROL}" />
      <circle cx="${cx - 0.6}" cy="${cy + 5}" r="0.6" fill="#ffffff" opacity="0.8" />
    </g>
  `;
}

function goofySmile(cx: number, cy: number, w: number, extraWide = false): string {
  const ww = extraWide ? w + 3 : w;
  return `
    <g>
      <path d="M ${cx - ww} ${cy} Q ${cx - ww} ${cy + 9}, ${cx} ${cy + 10} Q ${cx + ww} ${cy + 9}, ${cx + ww} ${cy} Q ${cx} ${cy - 1}, ${cx - ww} ${cy} Z"
            fill="${MOUTH_DARK}" stroke="${PETROL}" stroke-width="3" stroke-linejoin="round" />
      <ellipse cx="${cx + 1}" cy="${cy + 7}" rx="${(ww * 0.55).toFixed(2)}" ry="3" fill="${TONGUE}" />
      <ellipse cx="${cx - 0.5}" cy="${cy + 6.5}" rx="${(ww * 0.3).toFixed(2)}" ry="1.5" fill="${TONGUE_HIGHLIGHT}" opacity="0.7" />
      <rect x="${cx - 4.5}" y="${cy - 0.5}" width="3.5" height="5.5" rx="0.8" fill="${TEETH}" stroke="${PETROL}" stroke-width="1.4" />
      <rect x="${cx + 1}" y="${cy - 0.5}" width="3.5" height="5.5" rx="0.8" fill="${TEETH}" stroke="${PETROL}" stroke-width="1.4" />
    </g>
  `;
}

function moleBody(bodyColor: string, bellyColor: string): string {
  return `
    <g>
      <ellipse cx="50" cy="93" rx="32" ry="4.5" fill="${PETROL}" opacity="0.18" />
      <path d="M 50 12 C 28 12, 16 32, 16 56 C 16 78, 30 90, 50 90 C 70 90, 84 78, 84 56 C 84 32, 72 12, 50 12 Z"
            fill="${bodyColor}" stroke="${PETROL}" stroke-width="4" stroke-linejoin="round" />
      <ellipse cx="50" cy="68" rx="22" ry="18" fill="${bellyColor}" />
      <ellipse cx="34" cy="30" rx="11" ry="7" fill="#ffffff" opacity="0.4" transform="rotate(-30 34 30)" />
      ${paw(26, false, bodyColor)}
      ${paw(74, true, bodyColor)}
    </g>
  `;
}

function makeWrapper(variant: string, size: number, content: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = `mole mole--${variant}`;
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.width = `${size}px`;
  wrapper.style.height = `${size}px`;
  wrapper.innerHTML = `
    <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible">
      ${content}
    </svg>
  `;
  return wrapper;
}

export function renderStandardMole(size = 140): HTMLElement {
  const content =
    moleBody(MOLE, MOLE_BELLY) + sleepyEyes(36) + moleSnout(50, 48, SNOUT) + goofySmile(50, 66, 13);
  return makeWrapper('standard', size, content);
}

export function renderGoldenMole(size = 140): HTMLElement {
  const sparkles = `
    <g fill="${TREASURE}">
      <path d="M 10 38 l 1.2 2.5 l 2.5 1.2 l -2.5 1.2 l -1.2 2.5 l -1.2 -2.5 l -2.5 -1.2 l 2.5 -1.2 z" />
      <path d="M 88 50 l 1 2 l 2 1 l -2 1 l -1 2 l -1 -2 l -2 -1 l 2 -1 z" />
      <path d="M 86 80 l 0.8 1.6 l 1.6 0.8 l -1.6 0.8 l -0.8 1.6 l -0.8 -1.6 l -1.6 -0.8 l 1.6 -0.8 z" />
    </g>
  `;
  const hat = `
    <g>
      <ellipse cx="50" cy="20" rx="32" ry="5" fill="${HAT_BROWN}" stroke="${PETROL}" stroke-width="3" />
      <path d="M 22 19 Q 22 16 26 16 L 74 16 Q 78 16 78 19" fill="none" stroke="${PETROL}" stroke-width="2" opacity="0.5" />
      <path d="M 32 19 Q 32 4, 50 3 Q 68 4, 68 19 Z" fill="${HAT_BROWN}" stroke="${PETROL}" stroke-width="3" stroke-linejoin="round" />
      <rect x="32" y="14" width="36" height="4" fill="${HAT_BROWN_DARK}" />
      <rect x="32" y="14" width="36" height="4" fill="none" stroke="${PETROL}" stroke-width="1" opacity="0.4" />
      <path d="M 36 7 Q 38 5 42 5" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.4" stroke-linecap="round" />
      <path d="M 44 6 Q 50 9 56 6" stroke="${HAT_BROWN_DARK}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6" />
    </g>
  `;
  const content =
    sparkles +
    moleBody(TREASURE, GOLDEN_BELLY) +
    sleepyEyes(38) +
    moleSnout(50, 50, SNOUT_GOLD) +
    goofySmile(50, 68, 15, true) +
    hat;
  return makeWrapper('golden', size, content);
}

export function renderSpeedyMole(size = 140): HTMLElement {
  const speedLines = `
    <g stroke="${SPEED}" stroke-width="2.8" stroke-linecap="round" opacity="0.7">
      <line x1="2" y1="48" x2="11" y2="48" />
      <line x1="0" y1="58" x2="9" y2="58" />
      <line x1="3" y1="68" x2="11" y2="68" />
      <line x1="89" y1="48" x2="98" y2="48" />
      <line x1="91" y1="58" x2="100" y2="58" />
    </g>
  `;
  const scarf = `
    <g>
      <path d="M 22 56 Q 8 60, 1 70 Q 5 76, 12 72 Q 18 68, 26 68 Z" fill="${SCARF}" stroke="${PETROL}" stroke-width="3" stroke-linejoin="round" />
      <ellipse cx="35" cy="58" rx="11" ry="6" fill="${SCARF}" stroke="${PETROL}" stroke-width="3" />
      <path d="M 6 70 Q 10 68 14 71" stroke="${PETROL}" stroke-width="1.5" fill="none" opacity="0.6" />
    </g>
  `;
  const goggles = `
    <g>
      <rect x="20" y="22" width="60" height="6" rx="2" fill="${GOGGLE_LEATHER}" stroke="${PETROL}" stroke-width="2.5" />
      <circle cx="38" cy="28" r="9" fill="${GOGGLE_LEATHER}" stroke="${PETROL}" stroke-width="3" />
      <circle cx="38" cy="28" r="6" fill="${GOGGLE_GLASS}" stroke="${PETROL}" stroke-width="1.5" />
      <ellipse cx="35.5" cy="25.5" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.85" transform="rotate(-30 35.5 25.5)" />
      <circle cx="62" cy="28" r="9" fill="${GOGGLE_LEATHER}" stroke="${PETROL}" stroke-width="3" />
      <circle cx="62" cy="28" r="6" fill="${GOGGLE_GLASS}" stroke="${PETROL}" stroke-width="1.5" />
      <ellipse cx="59.5" cy="25.5" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.85" transform="rotate(-30 59.5 25.5)" />
    </g>
  `;
  const content =
    speedLines +
    moleBody(SPEED, SPEEDY_BELLY) +
    sleepyEyes(42) +
    moleSnout(50, 54, SNOUT_SPEEDY) +
    goofySmile(50, 70, 13) +
    scarf +
    goggles;
  return makeWrapper('speedy', size, content);
}

export function renderBomb(size = 140): HTMLElement {
  const fuse = `
    <ellipse cx="50" cy="92" rx="30" ry="5" fill="${PETROL}" opacity="0.2" />
    <path d="M 50 22 Q 56 14 62 12 Q 68 12 70 8" stroke="${BOMB_DARK}" stroke-width="3.5" fill="none" stroke-linecap="round" />
    <g>
      <circle cx="70" cy="8" r="6" fill="${TREASURE}" opacity="0.4" />
      <circle cx="70" cy="8" r="4.5" fill="${MOLE}" />
      <circle cx="70" cy="8" r="3" fill="${TREASURE}" />
      <circle cx="70" cy="8" r="1.5" fill="#ffffff" />
    </g>
    <rect x="46" y="20" width="8" height="6" rx="1.5" fill="${BOMB_DARK}" stroke="${PETROL}" stroke-width="2" />
  `;
  const body = `
    <circle cx="50" cy="58" r="32" fill="${BOMB_BODY}" stroke="${PETROL}" stroke-width="4" />
    <ellipse cx="38" cy="44" rx="9" ry="6" fill="#ffffff" opacity="0.3" transform="rotate(-25 38 44)" />
    <ellipse cx="50" cy="74" rx="20" ry="9" fill="${BOMB_BELLY_SHADOW}" opacity="0.6" />
  `;
  const face = `
    <g stroke="#ffffff" stroke-width="3.2" stroke-linecap="round">
      <line x1="33" y1="48" x2="43" y2="58" />
      <line x1="43" y1="48" x2="33" y2="58" />
      <line x1="57" y1="48" x2="67" y2="58" />
      <line x1="67" y1="48" x2="57" y2="58" />
    </g>
    <path d="M 40 70 Q 50 67 60 70" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" />
  `;
  return makeWrapper('bomb', size, fuse + body + face);
}
