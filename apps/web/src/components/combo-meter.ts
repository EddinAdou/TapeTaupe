import { el } from '../dom';

export function renderComboMeter(combo: number): HTMLElement {
  const visible = combo >= 2;
  return el(
    'div',
    {
      class: `combo-meter${visible ? '' : ' combo-meter--hidden'}`,
      'aria-hidden': !visible,
    },
    [`×${combo}`],
  );
}
