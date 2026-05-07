import { el } from '../dom';
import { renderCaption } from './caption';
import { renderGlassCard } from './glass-card';

type Accent = 'primary' | 'text';

export function renderStatCard(
  label: string,
  value: string | number,
  accent: Accent = 'text',
): HTMLElement {
  return renderGlassCard(
    [
      renderCaption(label),
      el('div', { class: `stat-card__value stat-card__value--${accent} tabular` }, [String(value)]),
    ],
    'stat-card',
  );
}
