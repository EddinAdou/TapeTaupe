import { renderBigScore } from '../components/big-score';
import { renderBigStat } from '../components/big-stat';
import { renderCaption } from '../components/caption';
import { renderChunkyButton, renderPlayTriangle } from '../components/chunky-button';
import { renderGlassCard } from '../components/glass-card';
import { el } from '../dom';
import { t } from '../i18n';
import { setScreen } from '../screen-manager';

const PLACEHOLDER = {
  score: 1240,
  level: 3,
  hits: 28,
  accuracy: 87,
  maxCombo: 12,
  bombsHit: 1,
};

function renderPill(text: string): HTMLElement {
  return renderGlassCard([renderCaption(text)], 'gameover__pill');
}

export function renderGameOver(): HTMLElement {
  return el('section', { class: 'screen screen-gameover' }, [
    el('div', { class: 'gameover__topbar' }, [
      renderPill(t('gameover.pill.over')),
      renderPill(`${t('gameover.pill.level')} · ${PLACEHOLDER.level}`),
    ]),

    el('div', { class: 'gameover__hero' }, [
      el('p', { class: 'gameover__headline' }, [t('gameover.headline')]),
      renderBigScore(PLACEHOLDER.score, { size: 'xl' }),
    ]),

    el('div', { class: 'gameover__stats' }, [
      renderBigStat(t('gameover.stat.hits'), PLACEHOLDER.hits, 'success'),
      renderBigStat(t('gameover.stat.accuracy'), `${PLACEHOLDER.accuracy}%`, 'text'),
      renderBigStat(t('gameover.stat.combo'), `×${PLACEHOLDER.maxCombo}`, 'primary'),
      renderBigStat(t('gameover.stat.bombs'), PLACEHOLDER.bombsHit, 'speed'),
    ]),

    el('div', { class: 'gameover__ctas' }, [
      renderChunkyButton({
        label: t('gameover.button.replay'),
        variant: 'primary',
        icon: renderPlayTriangle(20),
        onClick: () => setScreen('game'),
      }),
      renderChunkyButton({
        label: t('gameover.button.home'),
        variant: 'secondary',
        onClick: () => setScreen('home'),
      }),
    ]),
  ]);
}
