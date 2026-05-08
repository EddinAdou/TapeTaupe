import { el } from '../dom';

export type TimerVariant = 'ok' | 'warn' | 'crit';

export interface TimerBarRefs {
  root: HTMLElement;
  fillEl: HTMLElement;
}

export function variantForProgress(progress: number): TimerVariant {
  if (progress < 0.2) return 'crit';
  if (progress < 0.4) return 'warn';
  return 'ok';
}

export function renderTimerBar(progress: number): TimerBarRefs {
  const clamped = Math.max(0, Math.min(1, progress));
  const variant = variantForProgress(clamped);
  const fillEl = el('div', {
    class: `timer-bar__fill timer-bar__fill--${variant}`,
    style: `width: ${(clamped * 100).toFixed(1)}%;`,
  });
  const root = el('div', { class: 'timer-bar', role: 'progressbar' }, [fillEl]);
  return { root, fillEl };
}
