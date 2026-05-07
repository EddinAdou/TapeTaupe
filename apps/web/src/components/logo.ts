import { el } from '../dom';

const LETTERS = [...'TAPETAUPE'];
const ORANGE_FROM = 4; // T-A-P-E in petrol, T-A-U-P-E in mole

export function renderLogo(): HTMLElement {
  const container = el('div', { class: 'logo', 'aria-label': 'TAPETAUPE' });
  for (const [i, char] of LETTERS.entries()) {
    const orange = i >= ORANGE_FROM;
    const rot = i % 2 === 0 ? -2.5 : 2.5;
    const letter = el(
      'span',
      {
        class: `logo__letter${orange ? ' logo__letter--orange' : ''}`,
        style: `--rot:${rot}deg; animation-delay:${i * 80}ms;`,
        'aria-hidden': true,
      },
      [char],
    );
    container.append(letter);
  }
  return container;
}
