import { el } from '../dom';
import { t } from '../i18n';
import { setScreen } from '../screen-manager';

export function renderGameOver(): HTMLElement {
  return el('section', { class: 'screen screen-gameover' }, [
    el('h1', { class: 'font-display text-display-l' }, [t('gameover.title')]),
    el('p', { class: 'text-body-large tabular' }, [`${t('gameover.finalScore')}: 0`]),
    el('div', { class: 'screen-actions' }, [
      el(
        'button',
        {
          class: 'btn btn-primary text-body-large',
          onClick: () => setScreen('game'),
        },
        [t('gameover.button.replay')],
      ),
      el(
        'button',
        {
          class: 'btn text-body-large',
          onClick: () => setScreen('home'),
        },
        [t('gameover.button.home')],
      ),
    ]),
  ]);
}
