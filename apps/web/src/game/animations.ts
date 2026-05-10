function prefersReducedMotion(): boolean {
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type ScorePopupAccent = 'success' | 'gold' | 'primary' | 'danger';

export function playScorePopup(parent: HTMLElement, value: string, accent: ScorePopupAccent): void {
  const popup = document.createElement('div');
  popup.className = `score-popup score-popup--${accent}`;
  popup.textContent = value;
  parent.append(popup);
  if (prefersReducedMotion()) {
    setTimeout(() => popup.remove(), 800);
    return;
  }
  const animation = popup.animate(
    [
      { transform: 'translate(-50%, 0) scale(1)', opacity: 1 },
      { transform: 'translate(-50%, -42px) scale(1.18)', opacity: 0 },
    ],
    {
      duration: 700,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      fill: 'forwards',
    },
  );
  animation.addEventListener('finish', () => popup.remove());
}

export type ParticleAccent = 'primary' | 'gold' | 'danger';

const PARTICLE_COUNT = 14;
const PARTICLE_DURATION_MS = 600;

const ACCENT_COLOR: Record<ParticleAccent, string> = {
  primary: 'var(--color-mole)',
  gold: 'var(--color-treasure)',
  danger: 'var(--color-speed)',
};

export function playParticleBurst(parent: HTMLElement, accent: ParticleAccent): void {
  if (prefersReducedMotion()) return;
  const burst = document.createElement('div');
  burst.className = 'particle-burst';
  parent.append(burst);
  const palette = ['var(--color-sun)', ACCENT_COLOR[accent], 'var(--color-mole)'];
  const animations: Animation[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const dist = 40 + Math.random() * 36;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 14;
    const size = 6 + Math.random() * 6;
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = palette[i % 3] ?? ACCENT_COLOR[accent];
    burst.append(particle);
    const anim = particle.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        {
          transform: `translate(calc(-50% + ${dx.toFixed(1)}px), calc(-50% + ${dy.toFixed(1)}px)) scale(0.7)`,
          opacity: 0,
        },
      ],
      {
        duration: PARTICLE_DURATION_MS,
        easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
        fill: 'forwards',
      },
    );
    animations.push(anim);
  }
  Promise.all(animations.map((a) => a.finished))
    .then(() => burst.remove())
    .catch(() => burst.remove());
}

const SHAKE_AMPLITUDE_PX = 8;
const SHAKE_STEPS = 16;
const SHAKE_DURATION_MS = 480;

export function playBombShake(element: HTMLElement): void {
  if (prefersReducedMotion()) return;
  const keyframes: Keyframe[] = [];
  for (let i = 0; i < SHAKE_STEPS; i++) {
    const decay = 1 - i / SHAKE_STEPS;
    const x = (Math.random() - 0.5) * 2 * SHAKE_AMPLITUDE_PX * decay;
    const y = (Math.random() - 0.5) * 2 * SHAKE_AMPLITUDE_PX * decay;
    keyframes.push({ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)` });
  }
  keyframes.push({ transform: 'translate(0, 0)' });
  element.animate(keyframes, {
    duration: SHAKE_DURATION_MS,
    easing: 'linear',
    fill: 'forwards',
  });
}

export function playBombFlash(parent: HTMLElement): void {
  if (prefersReducedMotion()) return;
  const flash = document.createElement('div');
  flash.className = 'bomb-flash';
  parent.append(flash);
  const animation = flash.animate([{ opacity: 0 }, { opacity: 0.3, offset: 0.2 }, { opacity: 0 }], {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
    fill: 'forwards',
  });
  animation.addEventListener('finish', () => flash.remove());
}

const REST_TRANSFORM = 'translateX(-50%) translateY(0) scale(1)';
const HIDDEN_TRANSFORM = 'translateX(-50%) translateY(60%) scale(0)';
const PEAK_TRANSFORM = 'translateX(-50%) translateY(15%) scale(1.05)';

export function playEmerge(element: HTMLElement): Animation | null {
  if (prefersReducedMotion()) {
    element.style.transform = REST_TRANSFORM;
    return null;
  }
  element.style.transform = HIDDEN_TRANSFORM;
  return element.animate(
    [
      { transform: HIDDEN_TRANSFORM },
      { transform: PEAK_TRANSFORM, offset: 0.7 },
      { transform: REST_TRANSFORM },
    ],
    {
      duration: 220,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'forwards',
    },
  );
}

export async function playKill(element: HTMLElement): Promise<void> {
  if (prefersReducedMotion()) {
    element.style.opacity = '0';
    return;
  }
  const animation = element.animate(
    [
      { transform: REST_TRANSFORM, opacity: 1 },
      {
        transform: 'translateX(-50%) translateY(40%) scale(0) rotate(20deg)',
        opacity: 0,
      },
    ],
    {
      duration: 250,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      fill: 'forwards',
    },
  );
  await animation.finished;
}
