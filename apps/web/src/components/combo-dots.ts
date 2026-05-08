import { el } from '../dom';

const SEGMENT_COUNT = 10;

export function renderComboDots(combo: number): HTMLElement {
  const root = el('div', { class: 'combo-dots' });
  for (let i = 0; i < SEGMENT_COUNT; i++) {
    const filled = i < combo;
    root.append(
      el('div', {
        class: `combo-dots__segment${filled ? ' combo-dots__segment--filled' : ''}`,
      }),
    );
  }
  return root;
}
