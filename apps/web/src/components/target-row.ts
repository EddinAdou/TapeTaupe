import type { MoleType } from '@tapetaupe/shared';

import { el } from '../dom';
import {
  renderBomb,
  renderGoldenMole,
  renderSpeedyMole,
  renderStandardMole,
} from '../scene/characters';

interface TargetRowOptions {
  type: MoleType;
  label: string;
  points: string;
  subtitle?: string;
  danger?: boolean;
}

const ICON_SIZE = 36;

function renderTargetIcon(type: MoleType): HTMLElement {
  switch (type) {
    case 'standard': {
      return renderStandardMole(ICON_SIZE);
    }
    case 'golden': {
      return renderGoldenMole(ICON_SIZE);
    }
    case 'speedy': {
      return renderSpeedyMole(ICON_SIZE);
    }
    case 'bomb': {
      return renderBomb(ICON_SIZE);
    }
  }
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
