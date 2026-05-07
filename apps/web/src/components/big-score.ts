import { el } from '../dom';

export function renderBigScore(value: number, digits = 4): HTMLElement {
  const formatted = String(value).padStart(digits, '0');
  return el('div', { class: 'big-score tabular' }, [formatted]);
}
