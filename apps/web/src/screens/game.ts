import type { GameConfig, GameState } from '@tapetaupe/shared';

import { renderBigScore } from '../components/big-score';
import { renderCaption } from '../components/caption';
import { renderChunkyButton } from '../components/chunky-button';
import { renderComboDots } from '../components/combo-dots';
import { renderGlassCard } from '../components/glass-card';
import { renderLevelIndicator, levelProgress } from '../components/level-indicator';
import { renderLives } from '../components/lives';
import { renderStatRow } from '../components/stat-row';
import { renderTargetRow } from '../components/target-row';
import { renderTimerBar, variantForProgress } from '../components/timer-bar';
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
const SCORE_DIGITS = 5;
const MOLE_RENDER_SIZE = 110;
const HOLE_HINT_COUNT = 9;

function detectViewport(): Viewport {
  if (globalThis.matchMedia('(min-width: 1280px)').matches) return 'desktop';
  if (globalThis.matchMedia('(min-width: 768px)').matches) return 'tablet';
  return 'mobile';
}

interface ScoreCardRefs {
  root: HTMLElement;
  scoreEl: HTMLElement;
}

function buildScoreCard(state: Readonly<GameState>): ScoreCardRefs {
  const scoreEl = renderBigScore(state.score, { digits: SCORE_DIGITS });
  const root = renderGlassCard(
    [renderCaption(t('game.score')), scoreEl],
    'hud-card hud-card--score',
  );
  return { root, scoreEl };
}

interface ComboCardRefs {
  root: HTMLElement;
  valueEl: HTMLElement;
  dotsEl: HTMLElement;
}

function buildComboCard(state: Readonly<GameState>): ComboCardRefs {
  const valueEl = el(
    'span',
    { class: `combo-card__value tabular${state.combo >= 2 ? ' combo-card__value--active' : ''}` },
    [`×${Math.max(1, state.combo)}`],
  );
  const headerRow = el('div', { class: 'combo-card__header' }, [
    renderCaption(t('game.combo')),
    valueEl,
  ]);
  const dotsEl = renderComboDots(state.combo);
  const root = renderGlassCard([headerRow, dotsEl], 'hud-card hud-card--combo');
  return { root, valueEl, dotsEl };
}

interface LivesCardRefs {
  root: HTMLElement;
  livesEl: HTMLElement;
}

function buildLivesCard(state: Readonly<GameState>): LivesCardRefs {
  const livesEl = renderLives(state.lives, state.config.initialLives);
  const root = renderGlassCard(
    [renderCaption(t('game.lives')), livesEl],
    'hud-card hud-card--lives',
  );
  return { root, livesEl };
}

interface LevelCardRefs {
  root: HTMLElement;
  valueEl: HTMLElement;
  fillEl: HTMLElement;
}

function buildLevelCard(state: Readonly<GameState>): LevelCardRefs {
  const indicator = renderLevelIndicator(state.level, state.score);
  const root = renderGlassCard(
    [renderCaption(t('game.level')), indicator.root],
    'hud-card hud-card--level',
  );
  return { root, valueEl: indicator.valueEl, fillEl: indicator.fillEl };
}

interface TimerCardRefs {
  root: HTMLElement;
  textEl: HTMLElement;
  fillEl: HTMLElement;
}

function buildTimerCard(state: Readonly<GameState>): TimerCardRefs {
  const progress = state.timeLeftMs / state.config.gameDurationMs;
  const textEl = el('span', { class: 'timer-card__seconds tabular' }, [
    `${Math.ceil(state.timeLeftMs / 1000)}s`,
  ]);
  const header = el('div', { class: 'timer-card__header' }, [
    renderCaption(t('game.time')),
    textEl,
  ]);
  const bar = renderTimerBar(progress);
  const root = renderGlassCard([header, bar.root], 'hud-card hud-card--timer');
  return { root, textEl, fillEl: bar.fillEl };
}

function buildTargetsCard(): HTMLElement {
  return renderGlassCard(
    [
      renderCaption(t('game.targets')),
      el('div', { class: 'target-rows' }, [
        renderTargetRow({ type: 'standard', label: t('game.target.standard'), points: '+10' }),
        renderTargetRow({ type: 'golden', label: t('game.target.golden'), points: '+50' }),
        renderTargetRow({
          type: 'speedy',
          label: t('game.target.speedy'),
          points: '×2',
          subtitle: t('game.target.speedy.subtitle'),
        }),
        renderTargetRow({
          type: 'bomb',
          label: t('game.target.bomb'),
          points: '−1',
          subtitle: t('game.target.bomb.subtitle'),
          danger: true,
        }),
      ]),
    ],
    'hud-card hud-card--targets',
  );
}

interface StatsCardRefs {
  root: HTMLElement;
  hitsEl: HTMLElement;
  accuracyEl: HTMLElement;
  comboEl: HTMLElement;
}

function buildStatsCard(state: Readonly<GameState>): StatsCardRefs {
  const accuracy = state.taps > 0 ? Math.round((state.hits / state.taps) * 100) : 0;
  const hitsRow = renderStatRow(t('game.stat.hits'), state.hits);
  const accuracyRow = renderStatRow(t('game.stat.accuracy'), `${accuracy}%`);
  const comboRow = renderStatRow(t('game.stat.combo'), `×${state.comboMax}`);
  const root = renderGlassCard(
    [
      renderCaption(t('game.stats')),
      el('div', { class: 'stat-rows' }, [hitsRow, accuracyRow, comboRow]),
    ],
    'hud-card hud-card--stats',
  );
  const hitsEl = hitsRow.querySelector<HTMLElement>('.stat-row__value');
  const accuracyEl = accuracyRow.querySelector<HTMLElement>('.stat-row__value');
  const comboEl = comboRow.querySelector<HTMLElement>('.stat-row__value');
  if (!hitsEl || !accuracyEl || !comboEl) throw new Error('stat-row value missing');
  return { root, hitsEl, accuracyEl, comboEl };
}

function buildPlayfield(holeCount: number): { root: HTMLElement; cells: HTMLElement[] } {
  const cells: HTMLElement[] = [];
  const root = el('div', { class: 'playfield' });
  for (let i = 0; i < holeCount; i++) {
    const cell = el('div', { class: 'playfield__cell', 'data-hole': String(i) });
    cell.append(renderSandHole());
    if (i < HOLE_HINT_COUNT) {
      cell.append(el('span', { class: 'playfield__cell-hint' }, [String(i + 1)]));
    }
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

  const score = buildScoreCard(game.state);
  const combo = buildComboCard(game.state);
  const lives = buildLivesCard(game.state);
  const level = buildLevelCard(game.state);
  const timer = buildTimerCard(game.state);
  const targetsCard = buildTargetsCard();
  const stats = buildStatsCard(game.state);

  let livesCard = lives;
  let comboCard = combo;
  let statsCard = stats;

  const quitButton = renderChunkyButton({
    label: t('game.button.quit'),
    variant: 'secondary',
    onClick: () => {
      setLastGameStats(game.state);
      setScreen('gameover');
    },
  });
  quitButton.classList.add('hud-card--quit');

  const leftRail = el('aside', { class: 'hud-rail hud-rail--left' }, [
    score.root,
    combo.root,
    lives.root,
    level.root,
  ]);
  const rightRail = el('aside', { class: 'hud-rail hud-rail--right' }, [
    timer.root,
    targetsCard,
    stats.root,
    quitButton,
  ]);

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

  const element = el('section', { class: 'screen screen-game' }, [leftRail, playfield, rightRail]);

  let prevScore = game.state.score;
  let prevLives = game.state.lives;
  let prevLevel = game.state.level;
  let prevCombo = game.state.combo;
  let prevHits = game.state.hits;
  let prevTaps = game.state.taps;
  let prevComboMax = game.state.comboMax;
  let timerVariant = variantForProgress(game.state.timeLeftMs / game.state.config.gameDurationMs);
  let lastSeconds = Math.ceil(game.state.timeLeftMs / 1000);
  let redirecting = false;

  const updateHud = (state: Readonly<GameState>): void => {
    if (state.score !== prevScore) {
      score.scoreEl.textContent = String(state.score).padStart(SCORE_DIGITS, '0');
      level.fillEl.style.width = `${(levelProgress(state.score) * 100).toFixed(1)}%`;
      prevScore = state.score;
    }
    if (state.lives !== prevLives) {
      const next = buildLivesCard(state);
      livesCard.root.replaceWith(next.root);
      livesCard = next;
      prevLives = state.lives;
    }
    if (state.level !== prevLevel) {
      level.valueEl.textContent = String(state.level);
      prevLevel = state.level;
    }
    if (state.combo !== prevCombo) {
      const next = buildComboCard(state);
      comboCard.root.replaceWith(next.root);
      comboCard = next;
      prevCombo = state.combo;
    }
    if (state.hits !== prevHits || state.taps !== prevTaps || state.comboMax !== prevComboMax) {
      const next = buildStatsCard(state);
      statsCard.root.replaceWith(next.root);
      statsCard = next;
      prevHits = state.hits;
      prevTaps = state.taps;
      prevComboMax = state.comboMax;
    }
    const progress = Math.max(0, Math.min(1, state.timeLeftMs / state.config.gameDurationMs));
    timer.fillEl.style.width = `${(progress * 100).toFixed(1)}%`;
    const variant = variantForProgress(progress);
    if (variant !== timerVariant) {
      timer.fillEl.classList.remove(`timer-bar__fill--${timerVariant}`);
      timer.fillEl.classList.add(`timer-bar__fill--${variant}`);
      timerVariant = variant;
    }
    const seconds = Math.ceil(state.timeLeftMs / 1000);
    if (seconds !== lastSeconds) {
      timer.textEl.textContent = `${seconds}s`;
      lastSeconds = seconds;
    }
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
