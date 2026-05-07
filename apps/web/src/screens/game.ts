import { el } from '../dom';
import { t } from '../i18n';
import { setScreen } from '../screen-manager';

export function renderGame(): HTMLElement {
  return el('section', { class: 'screen screen-game' }, [
    el('header', { class: 'hud font-display text-display-m tabular' }, [
      el('div', {}, [`${t('game.score')}: 0`]),
      el('div', {}, [`${t('game.level')}: 1`]),
      el('div', {}, [`${t('game.time')}: 30s`]),
    ]),
    el('div', { class: 'board' }, []),
    el(
      'button',
      {
        class: 'btn text-body-large',
        onClick: () => setScreen('gameover'),
      },
      [t('game.button.quit')],
    ),
  ]);
}
