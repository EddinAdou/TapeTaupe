import { el } from '../dom';

const HEART_PATH =
  'M12 21s-7.5-4.7-7.5-11A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7.5 4c0 6.3-7.5 11-7.5 11Z';

function renderHeart(filled: boolean): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = `heart ${filled ? 'heart--filled' : 'heart--empty'}`;
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.innerHTML = `
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path d="${HEART_PATH}"
            fill="${filled ? 'var(--color-speed)' : 'rgba(255,255,255,0.6)'}"
            stroke="var(--color-petrol)"
            stroke-width="2"
            stroke-linejoin="round" />
    </svg>
  `;
  return wrapper;
}

export function renderLives(count: number, max = 3): HTMLElement {
  const container = el('div', {
    class: 'lives',
    role: 'status',
    'aria-label': `${count} vies sur ${max}`,
  });
  for (let i = 0; i < max; i++) {
    container.append(renderHeart(i < count));
  }
  return container;
}
