import type { MoleType } from '@tapetaupe/shared';

import { el } from '../dom';
import { renderStandardMole } from '../scene/characters';

interface TargetRowOptions {
  type: MoleType;
  label: string;
  points: string;
  subtitle?: string;
  danger?: boolean;
}

function renderTargetIcon(type: MoleType): HTMLElement {
  if (type === 'standard') return renderStandardMole(36);
  const wrapper = document.createElement('div');
  wrapper.className = `target-row__placeholder target-row__placeholder--${type}`;
  wrapper.setAttribute('aria-hidden', 'true');
  return wrapper;
}

export function renderTargetRow({
  type,
  label,
  points,
  subtitle,
  danger,
}: TargetRowOptions): HTMLElement {
  const labelEl = el('div', { class: 'target-row__label' }, [label]);
  const labelGroup = el('div', { class: 'target-row__text' }, [labelEl]);
  if (subtitle) {
    labelGroup.append(el('div', { class: 'target-row__subtitle' }, [subtitle]));
  }
  const pointsEl = el(
    'div',
    {
      class: `target-row__points${danger ? ' target-row__points--danger' : ''} tabular`,
    },
    [points],
  );
  return el('div', { class: 'target-row' }, [
    el('div', { class: 'target-row__icon' }, [renderTargetIcon(type)]),
    labelGroup,
    pointsEl,
  ]);
}
