const PETROL = 'var(--color-petrol)';
const SUN = 'var(--color-sun)';
const SUN_CHEEK = 'var(--color-sun-cheek)';
const CLOUD = 'var(--color-cloud)';
const SEA = 'var(--color-sea)';
const SAND_DARK = 'var(--color-sand-dark)';
const FOLIAGE = 'var(--color-foliage)';
const FOLIAGE_DARK = 'var(--color-foliage-dark)';
const COCONUT = 'var(--color-coconut)';
const COCONUT_LIGHT = 'var(--color-coconut-light)';
const MOLE_BELLY = 'var(--color-mole-belly)';
const MOLE = 'var(--color-mole)';
const TREASURE = 'var(--color-treasure)';

function buildSun(withFace = true): string {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    const x1 = 50 + Math.cos(a) * 44;
    const y1 = 50 + Math.sin(a) * 44;
    const x2 = 50 + Math.cos(a) * 56;
    const y2 = 50 + Math.sin(a) * 56;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${SUN}" stroke-width="4" stroke-linecap="round" opacity="0.7" />`;
  }).join('');

  const face = withFace
    ? `
      <path d="M 40 48 Q 43 52 46 48" stroke="${PETROL}" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M 54 48 Q 57 52 60 48" stroke="${PETROL}" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M 44 60 Q 50 65 56 60" stroke="${PETROL}" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <ellipse cx="40" cy="58" rx="3" ry="1.5" fill="${SUN_CHEEK}" opacity="0.6" />
      <ellipse cx="60" cy="58" rx="3" ry="1.5" fill="${SUN_CHEEK}" opacity="0.6" />
    `
    : '';

  return `
    <svg viewBox="0 0 100 100">
      <g class="tt-sun-halo">
        <circle cx="50" cy="50" r="48" fill="${SUN}" opacity="0.25" />
        <circle cx="50" cy="50" r="40" fill="${SUN}" opacity="0.4" />
        ${rays}
      </g>
      <g class="tt-sun-body">
        <circle cx="50" cy="50" r="32" fill="${SUN}" stroke="${PETROL}" stroke-width="3" />
        <ellipse cx="40" cy="40" rx="9" ry="6" fill="${CLOUD}" opacity="0.6" transform="rotate(-30 40 40)" />
        ${face}
      </g>
    </svg>
  `;
}

function buildCloud(): string {
  return `
    <svg viewBox="0 0 140 80">
      <path
        d="M 30 55 Q 16 55, 16 42 Q 16 30, 30 30 Q 32 18, 48 18 Q 60 12, 72 22 Q 88 18, 96 30 Q 110 30, 110 44 Q 122 46, 122 56 Q 122 66, 108 66 L 32 66 Q 18 66, 30 55 Z"
        fill="${CLOUD}"
        stroke="${PETROL}"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
  `;
}

function buildFrond(
  cx: number,
  cy: number,
  angleDeg: number,
  length: number,
  sway: string,
  duration: string,
  delay: string,
): string {
  const rad = (angleDeg * Math.PI) / 180;
  const tipX = cx + Math.cos(rad) * length;
  const tipY = cy + Math.sin(rad) * length;
  const w = length * 0.32;
  const perpX = -Math.sin(rad) * w;
  const perpY = Math.cos(rad) * w;
  const midX = cx + (tipX - cx) * 0.5;
  const midY = cy + (tipY - cy) * 0.5;

  return `
    <g class="tt-frond" style="--sway:${sway}; --ox:${cx}px; --oy:${cy}px; animation-duration:${duration}; animation-delay:${delay};">
      <path
        d="M ${cx} ${cy} Q ${(midX + perpX).toFixed(2)} ${(midY + perpY).toFixed(2)}, ${tipX.toFixed(2)} ${tipY.toFixed(2)} Q ${(midX - perpX).toFixed(2)} ${(midY - perpY).toFixed(2)}, ${cx} ${cy} Z"
        fill="${FOLIAGE}"
        stroke="${PETROL}"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <line x1="${cx}" y1="${cy}" x2="${tipX.toFixed(2)}" y2="${tipY.toFixed(2)}" stroke="${FOLIAGE_DARK}" stroke-width="1.5" opacity="0.6" />
    </g>
  `;
}

function buildPalmTree(coconuts = true): string {
  const fronds = [
    buildFrond(104, 75, -100, 90, '-7deg', '3.4s', '0s'),
    buildFrond(104, 75, -60, 100, '-9deg', '3.0s', '0.2s'),
    buildFrond(104, 75, -25, 95, '-6deg', '3.6s', '0.4s'),
    buildFrond(104, 75, 20, 85, '6deg', '3.2s', '0.1s'),
    buildFrond(104, 75, 60, 75, '8deg', '2.8s', '0.3s'),
  ].join('');

  const cocos = coconuts
    ? `
      <g class="tt-coco">
        <circle cx="98" cy="92" r="9" fill="${COCONUT}" stroke="${PETROL}" stroke-width="2.5" />
        <circle cx="113" cy="94" r="9" fill="${COCONUT}" stroke="${PETROL}" stroke-width="2.5" />
        <circle cx="105" cy="86" r="8" fill="${COCONUT_LIGHT}" stroke="${PETROL}" stroke-width="2.5" />
      </g>
    `
    : '';

  return `
    <svg viewBox="0 0 200 320" class="tt-palm">
      <path
        d="M 92 320 Q 86 240, 92 180 Q 96 120, 104 80 L 116 80 Q 110 120, 108 180 Q 106 240, 112 320 Z"
        fill="${COCONUT}"
        stroke="${PETROL}"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <g stroke="${PETROL}" stroke-width="2" fill="none" opacity="0.5">
        <path d="M 90 280 Q 100 278 114 280" />
        <path d="M 90 240 Q 100 238 113 240" />
        <path d="M 91 200 Q 100 198 112 200" />
        <path d="M 95 160 Q 102 158 110 160" />
        <path d="M 98 120 Q 104 118 109 120" />
      </g>
      ${fronds}
      ${cocos}
    </svg>
  `;
}

function buildSea(): string {
  return `
    <svg viewBox="0 0 1600 100" preserveAspectRatio="none">
      <rect x="0" y="0" width="1600" height="100" fill="${SEA}" />
      <g class="tt-sea-waves" stroke="${CLOUD}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.85">
        <path d="M 0 40 Q 160 25, 320 40 T 640 40 T 960 40 T 1280 40 T 1600 40" />
        <path d="M 0 70 Q 240 55, 480 70 T 960 70 T 1600 70" opacity="0.7" />
      </g>
    </svg>
  `;
}

function buildWindStreak(length: number): string {
  return `
    <svg width="${length}" height="14" viewBox="0 0 ${length} 14">
      <path d="M 2 7 Q ${(length * 0.3).toFixed(2)} 2, ${(length * 0.55).toFixed(2)} 7 T ${length - 2} 7"
            stroke="${CLOUD}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.65" />
      <path d="M 6 11 Q ${(length * 0.4).toFixed(2)} 7, ${(length * 0.7).toFixed(2)} 11"
            stroke="${CLOUD}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.4" />
    </svg>
  `;
}

function buildBird(): string {
  return `
    <svg width="32" height="18" viewBox="0 0 32 18">
      <g class="tt-bird-wing">
        <path d="M 2 9 Q 8 2, 16 9 Q 24 2, 30 9"
              stroke="${PETROL}" stroke-width="2.5"
              fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>
  `;
}

function buildShell(color: string): string {
  return `
    <svg viewBox="0 0 20 20">
      <path d="M 10 18 L 2 8 Q 10 0 18 8 Z" fill="${color}" stroke="${PETROL}" stroke-width="1.2" stroke-linejoin="round" />
      <line x1="10" y1="18" x2="6" y2="9" stroke="${PETROL}" stroke-width="1" opacity="0.6" />
      <line x1="10" y1="18" x2="10" y2="6" stroke="${PETROL}" stroke-width="1" opacity="0.6" />
      <line x1="10" y1="18" x2="14" y2="9" stroke="${PETROL}" stroke-width="1" opacity="0.6" />
    </svg>
  `;
}

function buildStarfish(): string {
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = ((i * 72 - 90) * Math.PI) / 180;
    pts.push(`${(10 + Math.cos(a) * 8).toFixed(2)},${(10 + Math.sin(a) * 8).toFixed(2)}`);
    const a2 = ((i * 72 - 54) * Math.PI) / 180;
    pts.push(`${(10 + Math.cos(a2) * 3.5).toFixed(2)},${(10 + Math.sin(a2) * 3.5).toFixed(2)}`);
  }
  return `
    <svg viewBox="0 0 20 20">
      <g class="tt-starfish">
        <polygon points="${pts.join(' ')}" fill="${MOLE}" stroke="${PETROL}" stroke-width="1.4" stroke-linejoin="round" />
        <circle cx="10" cy="10" r="1" fill="${PETROL}" opacity="0.4" />
      </g>
    </svg>
  `;
}

function buildFootprint(): string {
  return `
    <svg width="22" height="14" viewBox="0 0 22 14" style="opacity:0.4;">
      <ellipse cx="11" cy="9" rx="6" ry="4" fill="${SAND_DARK}" />
      <circle cx="11" cy="3" r="2" fill="${SAND_DARK}" />
      <circle cx="6" cy="2" r="1.2" fill="${SAND_DARK}" />
      <circle cx="16" cy="2" r="1.2" fill="${SAND_DARK}" />
    </svg>
  `;
}

export function renderScene(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'scene-bg';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.innerHTML = `
    <div class="tt-scene-sun">${buildSun(true)}</div>

    <div class="tt-scene-cloud tt-scene-cloud--1"><div class="tt-cloud">${buildCloud()}</div></div>
    <div class="tt-scene-cloud tt-scene-cloud--2"><div class="tt-cloud">${buildCloud()}</div></div>
    <div class="tt-scene-cloud tt-scene-cloud--3"><div class="tt-cloud">${buildCloud()}</div></div>

    <div class="tt-scene-wind tt-scene-wind--1"><div class="tt-wind">${buildWindStreak(60)}</div></div>
    <div class="tt-scene-wind tt-scene-wind--2"><div class="tt-wind">${buildWindStreak(50)}</div></div>
    <div class="tt-scene-wind tt-scene-wind--3"><div class="tt-wind">${buildWindStreak(70)}</div></div>

    <div class="tt-scene-bird"><div class="tt-bird">${buildBird()}</div></div>

    <div class="tt-scene-sea">${buildSea()}</div>

    <div class="tt-scene-sand">
      <div class="tt-scene-detail tt-scene-detail--shell-1">${buildShell(MOLE_BELLY)}</div>
      <div class="tt-scene-detail tt-scene-detail--shell-2">${buildShell(TREASURE)}</div>
      <div class="tt-scene-detail tt-scene-detail--shell-3">${buildShell(MOLE_BELLY)}</div>
      <div class="tt-scene-detail tt-scene-detail--starfish-1">${buildStarfish()}</div>
      <div class="tt-scene-detail tt-scene-detail--starfish-2">${buildStarfish()}</div>
      <div class="tt-scene-detail tt-scene-detail--footprint-1">${buildFootprint()}</div>
      <div class="tt-scene-detail tt-scene-detail--footprint-2">${buildFootprint()}</div>
    </div>

    <div class="tt-scene-palm tt-scene-palm--left">${buildPalmTree(true)}</div>
    <div class="tt-scene-palm tt-scene-palm--right">${buildPalmTree(true)}</div>
  `;
  return wrapper;
}
