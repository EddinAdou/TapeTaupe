import { el } from '../dom';
import { t } from '../i18n';
import { setScreen } from '../screen-manager';

export function renderHome(): HTMLElement {
  return el('section', { class: 'screen screen-home' }, [
    el('h1', { class: 'font-display text-display-l' }, [t('home.title')]),
    el('p', { class: 'text-body-large' }, [t('home.subtitle')]),
    el(
      'button',
      {
        class: 'btn btn-primary text-body-large',
        onClick: () => setScreen('game'),
      },
      [t('home.button.play')],
    ),
  ]);
}
