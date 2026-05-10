import { el } from '../dom';

export function renderStatRow(label: string, value: string | number): HTMLElement {
  return el('div', { class: 'stat-row' }, [
    el('span', { class: 'stat-row__label' }, [label]),
    el('span', { class: 'stat-row__value tabular' }, [String(value)]),
  ]);
}
