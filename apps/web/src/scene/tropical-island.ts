const SCENE_SVG = `
<svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--color-sky-light)" />
      <stop offset="80%" stop-color="var(--color-sky)" />
    </linearGradient>
  </defs>

  <!-- Sky -->
  <rect width="200" height="78" fill="url(#sky-gradient)" />

  <!-- Sun halo + sun -->
  <circle cx="172" cy="22" r="16" fill="var(--color-sun)" opacity="0.3" />
  <circle cx="172" cy="22" r="9" fill="var(--color-sun)" />

  <!-- Cloud 1 (puffy, 4 circles) -->
  <g transform="translate(28, 18)">
    <circle cx="0" cy="0" r="3.5" fill="var(--color-cloud)" stroke="var(--color-petrol)" stroke-width="0.5" />
    <circle cx="3.5" cy="-1.5" r="4" fill="var(--color-cloud)" stroke="var(--color-petrol)" stroke-width="0.5" />
    <circle cx="7" cy="0" r="3.5" fill="var(--color-cloud)" stroke="var(--color-petrol)" stroke-width="0.5" />
    <circle cx="10.5" cy="0.5" r="3" fill="var(--color-cloud)" stroke="var(--color-petrol)" stroke-width="0.5" />
  </g>

  <!-- Cloud 2 -->
  <g transform="translate(98, 12)">
    <circle cx="0" cy="0" r="3" fill="var(--color-cloud)" stroke="var(--color-petrol)" stroke-width="0.5" />
    <circle cx="3" cy="-0.5" r="3.5" fill="var(--color-cloud)" stroke="var(--color-petrol)" stroke-width="0.5" />
    <circle cx="6" cy="0" r="3" fill="var(--color-cloud)" stroke="var(--color-petrol)" stroke-width="0.5" />
  </g>

  <!-- Sea band -->
  <rect y="70" width="200" height="9" fill="var(--color-sea)" />
  <!-- Sea waves -->
  <path d="M 0 72 Q 8 71, 16 72 T 32 72 T 48 72 T 64 72 T 80 72 T 96 72 T 112 72 T 128 72 T 144 72 T 160 72 T 176 72 T 200 72"
        stroke="var(--color-cloud)" stroke-width="0.5" fill="none" />
  <path d="M 0 76 Q 8 75, 16 76 T 32 76 T 48 76 T 64 76 T 80 76 T 96 76 T 112 76 T 128 76 T 144 76 T 160 76 T 176 76 T 200 76"
        stroke="var(--color-cloud)" stroke-width="0.4" fill="none" opacity="0.6" />

  <!-- Sand (beach) -->
  <rect y="79" width="200" height="41" fill="var(--color-sand)" />

  <!-- Palm tree right (always visible) -->
  <g transform="translate(180, 90) scale(1.2)">
    <path d="M 0 20 Q -1 10, 0 -2 Q 1 -8, 2 -14"
          stroke="var(--color-coconut)" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <circle cx="-1" cy="-13" r="1.5" fill="var(--color-coconut)" stroke="var(--color-petrol)" stroke-width="0.4" />
    <circle cx="1.5" cy="-14" r="1.5" fill="var(--color-coconut)" stroke="var(--color-petrol)" stroke-width="0.4" />
    <path d="M 2 -14 Q -3 -19, -9 -18" stroke="var(--color-foliage)" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M 2 -14 Q 7 -19, 13 -18" stroke="var(--color-foliage)" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M 2 -14 Q 0 -21, -4 -25" stroke="var(--color-foliage)" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M 2 -14 Q 4 -21, 8 -25" stroke="var(--color-foliage)" stroke-width="2.2" fill="none" stroke-linecap="round" />
  </g>

  <!-- Palm tree left (hidden on mobile via CSS) -->
  <g class="scene-palm-left" transform="translate(20, 92) scale(1.1)">
    <path d="M 0 20 Q 1 10, 0 -2 Q -1 -8, -2 -14"
          stroke="var(--color-coconut)" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <circle cx="-1.5" cy="-13" r="1.4" fill="var(--color-coconut)" stroke="var(--color-petrol)" stroke-width="0.4" />
    <path d="M -2 -14 Q -7 -19, -13 -18" stroke="var(--color-foliage)" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M -2 -14 Q 3 -19, 9 -18" stroke="var(--color-foliage)" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M -2 -14 Q -4 -21, -8 -25" stroke="var(--color-foliage)" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M -2 -14 Q 0 -21, 4 -25" stroke="var(--color-foliage)" stroke-width="2.2" fill="none" stroke-linecap="round" />
  </g>
</svg>
`;

export function renderScene(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'scene-bg';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.innerHTML = SCENE_SVG;
  return wrapper;
}
