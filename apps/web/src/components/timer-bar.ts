import { el } from '../dom';

export function renderTimerBar(progress: number): HTMLElement {
  const clamped = Math.max(0, Math.min(1, progress));
  return el('div', { class: 'timer-bar', role: 'progressbar' }, [
    el('div', { class: 'timer-bar__fill', style: `width: ${(clamped * 100).toFixed(1)}%;` }, []),
  ]);
}
