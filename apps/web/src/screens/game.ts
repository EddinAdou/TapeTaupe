import { renderBigScore } from '../components/big-score';
import { renderCaption } from '../components/caption';
import { renderChunkyButton } from '../components/chunky-button';
import { renderComboMeter } from '../components/combo-meter';
import { renderGlassCard } from '../components/glass-card';
import { renderLives } from '../components/lives';
import { renderTimerBar } from '../components/timer-bar';
import { el } from '../dom';
import { t } from '../i18n';
import { renderStandardMole } from '../scene/characters';
import { renderSandHole } from '../scene/sand-hole';
import { setScreen } from '../screen-manager';

// Phase 1.5 placeholder values — real game state arrives in Phase 2.
const PLACEHOLDER_SCORE = 0;
const PLACEHOLDER_LIVES = 3;
const PLACEHOLDER_LEVEL = 1;
const PLACEHOLDER_COMBO = 0;
const PLACEHOLDER_TIMER_PROGRESS = 1;
const PLACEHOLDER_HOLE_COUNT = 16;
// Show a couple of moles in fixed cells so the screen looks alive in Phase 1.
const DEMO_MOLE_CELLS = new Set<number>([5, 9]);

function renderHud(): HTMLElement {
  return renderGlassCard(
    [
      el('div', { class: 'hud__group hud__group--score' }, [
        renderCaption(t('game.score')),
        renderBigScore(PLACEHOLDER_SCORE),
      ]),
      el('div', { class: 'hud__group hud__group--center' }, [
        renderLives(PLACEHOLDER_LIVES),
        el('div', { class: 'hud__level' }, [
          renderCaption(t('game.level')),
          el('span', { class: 'hud__level-value tabular' }, [String(PLACEHOLDER_LEVEL)]),
        ]),
      ]),
      el('div', { class: 'hud__group hud__group--right' }, [
        renderComboMeter(PLACEHOLDER_COMBO),
        el('div', { class: 'hud__timer' }, [
          renderCaption(t('game.time')),
          renderTimerBar(PLACEHOLDER_TIMER_PROGRESS),
        ]),
      ]),
    ],
    'hud',
  );
}

function renderHole(index: number): HTMLElement {
  const cell = el('div', {
    class: 'playfield__cell',
    'data-hole': String(index),
  });
  cell.append(renderSandHole(220, 100));
  if (DEMO_MOLE_CELLS.has(index)) {
    const mole = el('div', { class: 'playfield__mole' }, [renderStandardMole(110)]);
    cell.append(mole);
  }
  return cell;
}

function renderPlayfield(holeCount: number): HTMLElement {
  const grid = el('div', { class: 'playfield' });
  for (let i = 0; i < holeCount; i++) {
    grid.append(renderHole(i));
  }
  return grid;
}

export function renderGame(): HTMLElement {
  return el('section', { class: 'screen screen-game' }, [
    renderHud(),
    renderPlayfield(PLACEHOLDER_HOLE_COUNT),
    renderChunkyButton({
      label: t('game.button.quit'),
      variant: 'secondary',
      onClick: () => setScreen('gameover'),
    }),
  ]);
}
