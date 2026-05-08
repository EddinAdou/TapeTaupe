import type { GameConfig, GameState } from '@tapetaupe/shared';

import { renderBigScore } from '../components/big-score';
import { renderCaption } from '../components/caption';
import { renderChunkyButton } from '../components/chunky-button';
import { renderComboMeter } from '../components/combo-meter';
import { renderGlassCard } from '../components/glass-card';
import { renderLives } from '../components/lives';
import { renderTimerBar } from '../components/timer-bar';
import { el } from '../dom';
import { playEmerge, playKill } from '../game/animations';
import { setLastGameStats } from '../game/last-game';
import { createGame } from '../game/loop';
import { t } from '../i18n';
import { renderStandardMole } from '../scene/characters';
import { renderSandHole } from '../scene/sand-hole';
import type { ScreenInstance } from '../screen-manager';
import { setScreen } from '../screen-manager';

type Viewport = 'mobile' | 'tablet' | 'desktop';

const HOLES_BY_VIEWPORT: Record<Viewport, number> = {
  mobile: 9,
  tablet: 16,
  desktop: 20,
};

const INITIAL_LIVES = 3;
const GAME_DURATION_MS = 60_000;
const SCORE_DIGITS = 4;
const MOLE_RENDER_SIZE = 110;

function detectViewport(): Viewport {
  if (globalThis.matchMedia('(min-width: 1280px)').matches) return 'desktop';
  if (globalThis.matchMedia('(min-width: 768px)').matches) return 'tablet';
  return 'mobile';
}

interface HudRefs {
  root: HTMLElement;
  scoreEl: HTMLElement;
  livesEl: HTMLElement;
  levelEl: HTMLElement;
  comboEl: HTMLElement;
  timerFillEl: HTMLElement;
}

function buildHud(state: Readonly<GameState>): HudRefs {
  const scoreEl = renderBigScore(state.score, { digits: SCORE_DIGITS });
  const livesEl = renderLives(state.lives, state.config.initialLives);
  const levelEl = el('span', { class: 'hud__level-value tabular' }, [String(state.level)]);
  const comboEl = renderComboMeter(state.combo);
  const timerBar = renderTimerBar(state.timeLeftMs / state.config.gameDurationMs);
  const timerFillEl = timerBar.querySelector<HTMLElement>('.timer-bar__fill');
  if (!timerFillEl) throw new Error('timer-bar fill missing');

  const root = renderGlassCard(
    [
      el('div', { class: 'hud__group hud__group--score' }, [
        renderCaption(t('game.score')),
        scoreEl,
      ]),
      el('div', { class: 'hud__group hud__group--center' }, [
        livesEl,
        el('div', { class: 'hud__level' }, [renderCaption(t('game.level')), levelEl]),
      ]),
      el('div', { class: 'hud__group hud__group--right' }, [
        comboEl,
        el('div', { class: 'hud__timer' }, [renderCaption(t('game.time')), timerBar]),
      ]),
    ],
    'hud',
  );

  return { root, scoreEl, livesEl, levelEl, comboEl, timerFillEl };
}

function buildPlayfield(holeCount: number): { root: HTMLElement; cells: HTMLElement[] } {
  const cells: HTMLElement[] = [];
  const root = el('div', { class: 'playfield' });
  for (let i = 0; i < holeCount; i++) {
    const cell = el('div', { class: 'playfield__cell', 'data-hole': String(i) });
    cell.append(renderSandHole());
    cells.push(cell);
    root.append(cell);
  }
  return { root, cells };
}

export function renderGame(): ScreenInstance {
  const holeCount = HOLES_BY_VIEWPORT[detectViewport()];
  const config: GameConfig = {
    holeCount,
    initialLives: INITIAL_LIVES,
    gameDurationMs: GAME_DURATION_MS,
  };
  const game = createGame(config);

  const hud = buildHud(game.state);
  const { scoreEl, levelEl, timerFillEl } = hud;
  let livesEl = hud.livesEl;
  let comboEl = hud.comboEl;

  const { root: playfield, cells } = buildPlayfield(holeCount);
  const moleNodes = new Map<number, { node: HTMLElement; emerge: Animation | null }>();

  const handlePointerDown = (event: PointerEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const cell = target.closest<HTMLElement>('[data-hole]');
    if (!cell || !playfield.contains(cell)) return;
    const holeIndex = Number(cell.dataset.hole);
    if (!Number.isInteger(holeIndex)) return;
    game.tap(holeIndex, event.clientX, event.clientY);
  };
  playfield.addEventListener('pointerdown', handlePointerDown);

  const quitButton = renderChunkyButton({
    label: t('game.button.quit'),
    variant: 'secondary',
    onClick: () => {
      setLastGameStats(game.state);
      setScreen('gameover');
    },
  });

  const element = el('section', { class: 'screen screen-game' }, [hud.root, playfield, quitButton]);

  let prevScore = game.state.score;
  let prevLives = game.state.lives;
  let prevLevel = game.state.level;
  let prevCombo = game.state.combo;
  let redirecting = false;

  const updateHud = (state: Readonly<GameState>): void => {
    if (state.score !== prevScore) {
      scoreEl.textContent = String(state.score).padStart(SCORE_DIGITS, '0');
      prevScore = state.score;
    }
    if (state.lives !== prevLives) {
      const next = renderLives(state.lives, state.config.initialLives);
      livesEl.replaceWith(next);
      livesEl = next;
      prevLives = state.lives;
    }
    if (state.level !== prevLevel) {
      levelEl.textContent = String(state.level);
      prevLevel = state.level;
    }
    if (state.combo !== prevCombo) {
      const next = renderComboMeter(state.combo);
      comboEl.replaceWith(next);
      comboEl = next;
      prevCombo = state.combo;
    }
    const progress = Math.max(0, Math.min(1, state.timeLeftMs / state.config.gameDurationMs));
    timerFillEl.style.width = `${(progress * 100).toFixed(1)}%`;
  };

  const syncMoles = (state: Readonly<GameState>): void => {
    const liveIds = new Set<number>();
    for (const mole of state.activeMoles) {
      liveIds.add(mole.id);
      if (moleNodes.has(mole.id)) continue;
      const cell = cells[mole.holeIndex];
      if (!cell) continue;
      const node = el('div', { class: 'playfield__mole' }, [renderStandardMole(MOLE_RENDER_SIZE)]);
      cell.append(node);
      const emerge = playEmerge(node);
      moleNodes.set(mole.id, { node, emerge });
    }
    for (const [id, entry] of moleNodes) {
      if (liveIds.has(id)) continue;
      moleNodes.delete(id);
      entry.emerge?.cancel();
      entry.node.style.pointerEvents = 'none';
      void playKill(entry.node).then(() => {
        entry.node.remove();
      });
    }
  };

  const unsubscribe = game.subscribe((state) => {
    updateHud(state);
    syncMoles(state);
    if (state.status === 'game_over' && !redirecting) {
      redirecting = true;
      setLastGameStats(state);
      queueMicrotask(() => setScreen('gameover'));
    }
  });

  game.start();

  const cleanup = (): void => {
    unsubscribe();
    game.stop();
    playfield.removeEventListener('pointerdown', handlePointerDown);
    for (const entry of moleNodes.values()) {
      entry.emerge?.cancel();
      entry.node.remove();
    }
    moleNodes.clear();
  };

  return { element, cleanup };
}
