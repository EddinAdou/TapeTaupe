import { renderBigScore } from '../components/big-score';
import { renderBigStat } from '../components/big-stat';
import { renderCaption } from '../components/caption';
import { renderChunkyButton, renderPlayTriangle } from '../components/chunky-button';
import { renderGlassCard } from '../components/glass-card';
import { el } from '../dom';
import { getLastGameStats, type LastGameStats } from '../game/last-game';
import { t } from '../i18n';
import type { ScreenInstance } from '../screen-manager';
import { setScreen } from '../screen-manager';

const DEFAULT_STATS: LastGameStats = {
  score: 0,
  level: 1,
  hits: 0,
  accuracy: 0,
  maxCombo: 0,
  bombsHit: 0,
};

function renderPill(text: string): HTMLElement {
  return renderGlassCard([renderCaption(text)], 'gameover__pill');
}

export function renderGameOver(): ScreenInstance {
  const stats = getLastGameStats() ?? DEFAULT_STATS;

  const element = el('section', { class: 'screen screen-gameover' }, [
    el('div', { class: 'gameover__topbar' }, [
      renderPill(t('gameover.pill.over')),
      renderPill(`${t('gameover.pill.level')} · ${stats.level}`),
    ]),

    el('div', { class: 'gameover__hero' }, [
      el('p', { class: 'gameover__headline' }, [t('gameover.headline')]),
      renderBigScore(stats.score, { size: 'xl' }),
    ]),

    el('div', { class: 'gameover__stats' }, [
      renderBigStat(t('gameover.stat.hits'), stats.hits, 'success'),
      renderBigStat(t('gameover.stat.accuracy'), `${stats.accuracy}%`, 'text'),
      renderBigStat(t('gameover.stat.combo'), `×${stats.maxCombo}`, 'primary'),
      renderBigStat(t('gameover.stat.bombs'), stats.bombsHit, 'speed'),
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
  return { element };
}
