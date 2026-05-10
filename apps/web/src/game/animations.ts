function prefersReducedMotion(): boolean {
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type ScorePopupAccent = 'success' | 'gold' | 'danger';

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
