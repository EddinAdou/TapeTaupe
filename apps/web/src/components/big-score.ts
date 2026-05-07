import { el } from '../dom';

interface BigScoreOptions {
  digits?: number;
  size?: 'normal' | 'xl';
}

export function renderBigScore(value: number, options: BigScoreOptions = {}): HTMLElement {
  const { digits = 4, size = 'normal' } = options;
  const formatted = String(value).padStart(digits, '0');
  const cls = size === 'xl' ? 'big-score big-score--xl tabular' : 'big-score tabular';
  return el('div', { class: cls }, [formatted]);
}
