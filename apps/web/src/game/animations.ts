function prefersReducedMotion(): boolean {
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function playEmerge(element: HTMLElement): Animation | null {
  if (prefersReducedMotion()) {
    element.style.transform = 'scale(1)';
    return null;
  }
  return element.animate(
    [{ transform: 'scale(0.3)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }],
    {
      duration: 220,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'forwards',
    },
  );
}

export async function playKill(element: HTMLElement): Promise<void> {
  if (prefersReducedMotion()) {
    element.style.transform = 'scale(0)';
    element.style.opacity = '0';
    return;
  }
  const animation = element.animate(
    [
      { transform: 'scale(1) rotate(0deg)', opacity: 1 },
      { transform: 'scale(0) rotate(20deg)', opacity: 0 },
    ],
    {
      duration: 250,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      fill: 'forwards',
    },
  );
  await animation.finished;
}
