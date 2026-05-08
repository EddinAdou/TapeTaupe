function prefersReducedMotion(): boolean {
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
