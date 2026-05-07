import { el } from '../dom';

export function renderGlassCard(children: (Node | string)[], extraClass = ''): HTMLElement {
  const cls = extraClass ? `glass-card ${extraClass}` : 'glass-card';
  return el('div', { class: cls }, children);
}
