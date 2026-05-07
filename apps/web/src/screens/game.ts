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

type Viewport = 'mobile' | 'tablet' | 'desktop';

const HOLES_BY_VIEWPORT: Record<Viewport, number> = {
  mobile: 9, // 3×3
  tablet: 16, // 4×4
  desktop: 20, // 5×4
};

function detectViewport(): Viewport {
  if (globalThis.matchMedia('(min-width: 1280px)').matches) return 'desktop';
  if (globalThis.matchMedia('(min-width: 768px)').matches) return 'tablet';
  return 'mobile';
}

function pickDemoMoleCells(holeCount: number): Set<number> {
  // Show 2 mascots roughly in the middle so the screen looks alive in Phase 1.
  const a = Math.floor(holeCount / 3);
  const b = Math.floor((holeCount * 2) / 3);
  return new Set([a, b]);
}

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

function renderHole(index: number, demoMoles: Set<number>): HTMLElement {
  const cell = el('div', {
    class: 'playfield__cell',
    'data-hole': String(index),
  });
  cell.append(renderSandHole());
  if (demoMoles.has(index)) {
    const mole = el('div', { class: 'playfield__mole' }, [renderStandardMole(110)]);
    cell.append(mole);
  }
  return cell;
}

function renderPlayfield(holeCount: number): HTMLElement {
  const demoMoles = pickDemoMoleCells(holeCount);
  const grid = el('div', { class: 'playfield' });
  for (let i = 0; i < holeCount; i++) {
    grid.append(renderHole(i, demoMoles));
  }
  return grid;
}

export function renderGame(): HTMLElement {
  const holeCount = HOLES_BY_VIEWPORT[detectViewport()];
  return el('section', { class: 'screen screen-game' }, [
    renderHud(),
    renderPlayfield(holeCount),
    renderChunkyButton({
      label: t('game.button.quit'),
      variant: 'secondary',
      onClick: () => setScreen('gameover'),
    }),
  ]);
}
