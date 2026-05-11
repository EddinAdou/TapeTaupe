import { el } from '../dom';
import { MAX_LEVEL, POINTS_PER_LEVEL } from '../game/scoring';

export interface LevelIndicatorRefs {
  root: HTMLElement;
  valueEl: HTMLElement;
  fillEl: HTMLElement;
}

export function renderLevelIndicator(level: number, score: number): LevelIndicatorRefs {
  const valueEl = el('span', { class: 'level-indicator__value tabular' }, [String(level)]);
  const totalEl = el('span', { class: 'level-indicator__total' }, [` / ${MAX_LEVEL}`]);
  const fillEl = el('div', {
    class: 'level-indicator__fill',
    style: `width: ${levelProgress(score) * 100}%;`,
  });
  const track = el('div', { class: 'level-indicator__track' }, [fillEl]);
  const root = el('div', { class: 'level-indicator' }, [
    el('div', { class: 'level-indicator__row' }, [valueEl, totalEl]),
    track,
  ]);
  return { root, valueEl, fillEl };
}

export function levelProgress(score: number): number {
  return (score % POINTS_PER_LEVEL) / POINTS_PER_LEVEL;
}
