import { el } from '../dom';
import { renderCaption } from './caption';
import { renderGlassCard } from './glass-card';

type Accent = 'primary' | 'success' | 'speed' | 'sun' | 'text';

export function renderBigStat(
  label: string,
  value: string | number,
  accent: Accent = 'text',
): HTMLElement {
  return renderGlassCard(
    [
      renderCaption(label),
      el('div', { class: `big-stat__value big-stat__value--${accent} tabular` }, [String(value)]),
    ],
    'big-stat',
  );
}
