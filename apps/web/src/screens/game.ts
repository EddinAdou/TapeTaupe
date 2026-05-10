import type { GameConfig, GameState, MoleType } from '@tapetaupe/shared';

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
import {
  type ParticleAccent,
  playBombFlash,
  playBombShake,
  playEmerge,
  playKill,
  playParticleBurst,
  playPulse,
  playScorePopup,
} from '../game/animations';
import { setLastGameStats } from '../game/last-game';
import { createGame } from '../game/loop';
import { t } from '../i18n';
import {
  renderBomb,
  renderGoldenMole,
  renderSpeedyMole,
  renderStandardMole,
} from '../scene/characters';
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
const RAIL_SCORE_DIGITS = 5;
const MOBILE_SCORE_DIGITS = 4;
const MOLE_RENDER_SIZE = 140;
const HOLE_HINT_COUNT = 9;

function renderMoleByType(type: MoleType, size: number): HTMLElement {
  switch (type) {
    case 'standard': {
      return renderStandardMole(size);
    }
    case 'golden': {
      return renderGoldenMole(size);
    }
    case 'speedy': {
      return renderSpeedyMole(size);
    }
    case 'bomb': {
      return renderBomb(size);
    }
  }
}

function particleAccentForType(type: MoleType): ParticleAccent {
  switch (type) {
    case 'golden': {
      return 'gold';
    }
    case 'speedy':
    case 'bomb': {
      return 'danger';
    }
    case 'standard': {
      return 'primary';
    }
  }
}

function detectViewport(): Viewport {
  if (globalThis.matchMedia('(min-width: 1280px)').matches) return 'desktop';
  if (globalThis.matchMedia('(min-width: 768px)').matches) return 'tablet';
  return 'mobile';
}

interface Hud {
  pre: HTMLElement[];
  post: HTMLElement[];
  applyUpdate: (state: Readonly<GameState>) => void;
}

interface ScoreCardRefs {
  root: HTMLElement;
  scoreEl: HTMLElement;
}

function buildScoreCard(state: Readonly<GameState>): ScoreCardRefs {
  const scoreEl = renderBigScore(state.score, { digits: RAIL_SCORE_DIGITS });
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
  const boosted = state.boostHitsLeft > 0;
  const displayMultiplier = boosted ? 2 : Math.max(1, state.combo);
  const active = boosted || state.combo >= 2;
  const valueEl = el(
    'span',
    { class: `combo-card__value tabular${active ? ' combo-card__value--active' : ''}` },
    [`×${displayMultiplier}`],
  );
  const headerRow = el('div', { class: 'combo-card__header' }, [
    renderCaption(t('game.combo')),
    valueEl,
  ]);
  const dotsEl = renderComboDots(state.combo, boosted);
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
}

function buildStatsCard(state: Readonly<GameState>): StatsCardRefs {
  const accuracy = state.taps > 0 ? Math.round((state.hits / state.taps) * 100) : 0;
  const root = renderGlassCard(
    [
      renderCaption(t('game.stats')),
      el('div', { class: 'stat-rows' }, [
        renderStatRow(t('game.stat.hits'), state.hits),
        renderStatRow(t('game.stat.accuracy'), `${accuracy}%`),
        renderStatRow(t('game.stat.combo'), `×${state.comboMax}`),
      ]),
    ],
    'hud-card hud-card--stats',
  );
  return { root };
}

function buildRailsHud(state: Readonly<GameState>, quitButton: HTMLElement): Hud {
  const score = buildScoreCard(state);
  const level = buildLevelCard(state);
  const timer = buildTimerCard(state);
  const targetsCard = buildTargetsCard();
  let combo = buildComboCard(state);
  let lives = buildLivesCard(state);
  let stats = buildStatsCard(state);

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

  let prevScore = state.score;
  let prevLives = state.lives;
  let prevLevel = state.level;
  let prevCombo = state.combo;
  let prevBoostForCombo = state.boostHitsLeft;
  let prevHits = state.hits;
  let prevTaps = state.taps;
  let prevComboMax = state.comboMax;
  let timerVariant = variantForProgress(state.timeLeftMs / state.config.gameDurationMs);
  let lastSeconds = Math.ceil(state.timeLeftMs / 1000);

  const applyUpdate = (next: Readonly<GameState>): void => {
    if (next.score !== prevScore) {
      score.scoreEl.textContent = String(next.score).padStart(RAIL_SCORE_DIGITS, '0');
      level.fillEl.style.width = `${(levelProgress(next.score) * 100).toFixed(1)}%`;
      prevScore = next.score;
    }
    if (next.lives !== prevLives) {
      const updated = buildLivesCard(next);
      lives.root.replaceWith(updated.root);
      lives = updated;
      prevLives = next.lives;
    }
    if (next.level !== prevLevel) {
      level.valueEl.textContent = String(next.level);
      prevLevel = next.level;
    }
    const comboIncremented = next.combo > prevCombo;
    if (next.combo !== prevCombo || next.boostHitsLeft !== prevBoostForCombo) {
      const updated = buildComboCard(next);
      combo.root.replaceWith(updated.root);
      combo = updated;
      if (comboIncremented) playPulse(updated.valueEl);
      prevCombo = next.combo;
      prevBoostForCombo = next.boostHitsLeft;
    }
    if (next.hits !== prevHits || next.taps !== prevTaps || next.comboMax !== prevComboMax) {
      const updated = buildStatsCard(next);
      stats.root.replaceWith(updated.root);
      stats = updated;
      prevHits = next.hits;
      prevTaps = next.taps;
      prevComboMax = next.comboMax;
    }
    const progress = Math.max(0, Math.min(1, next.timeLeftMs / next.config.gameDurationMs));
    timer.fillEl.style.width = `${(progress * 100).toFixed(1)}%`;
    const variant = variantForProgress(progress);
    if (variant !== timerVariant) {
      timer.fillEl.classList.remove(`timer-bar__fill--${timerVariant}`);
      timer.fillEl.classList.add(`timer-bar__fill--${variant}`);
      timerVariant = variant;
    }
    const seconds = Math.ceil(next.timeLeftMs / 1000);
    if (seconds !== lastSeconds) {
      timer.textEl.textContent = `${seconds}s`;
      lastSeconds = seconds;
    }
  };

  return { pre: [leftRail], post: [rightRail], applyUpdate };
}

function buildMobileHud(state: Readonly<GameState>, quitButton: HTMLElement): Hud {
  const scoreEl = renderBigScore(state.score, { digits: MOBILE_SCORE_DIGITS });
  let livesEl = renderLives(state.lives, state.config.initialLives);
  const levelValueEl = el('span', { class: 'mobile-hud__level-value tabular' }, [
    String(state.level),
  ]);

  const progress = state.timeLeftMs / state.config.gameDurationMs;
  const seconds = Math.ceil(state.timeLeftMs / 1000);
  const timerSecondsEl = el('span', { class: 'mobile-hud__timer-seconds tabular' }, [
    `${seconds}s`,
  ]);
  const timerBar = renderTimerBar(progress);

  const initialBoosted = state.boostHitsLeft > 0;
  const initialDisplayMultiplier = initialBoosted ? 2 : Math.max(1, state.combo);
  const initialActive = initialBoosted || state.combo >= 2;
  const comboValueEl = el('span', { class: 'mobile-hud__combo-value tabular' }, [
    `×${initialDisplayMultiplier}`,
  ]);
  let comboDotsEl = renderComboDots(state.combo, initialBoosted);
  const comboBox = el(
    'div',
    {
      class: `mobile-hud__combo${initialActive ? ' mobile-hud__combo--active' : ''}`,
    },
    [
      el('div', { class: 'mobile-hud__combo-header' }, [
        renderCaption(t('game.combo')),
        comboValueEl,
      ]),
      comboDotsEl,
    ],
  );

  const topRow = el('div', { class: 'mobile-hud__top' }, [
    el('div', { class: 'mobile-hud__score-block' }, [renderCaption(t('game.score')), scoreEl]),
    el('div', { class: 'mobile-hud__right-block' }, [
      livesEl,
      el('div', { class: 'mobile-hud__level' }, [renderCaption(t('game.level')), levelValueEl]),
    ]),
  ]);
  const timerSection = el('div', { class: 'mobile-hud__timer-section' }, [
    el('div', { class: 'mobile-hud__timer-header' }, [
      renderCaption(t('game.time')),
      timerSecondsEl,
    ]),
    timerBar.root,
  ]);

  const topBar = renderGlassCard([topRow, timerSection, comboBox], 'mobile-hud');

  let prevScore = state.score;
  let prevLives = state.lives;
  let prevLevel = state.level;
  let prevCombo = state.combo;
  let prevBoostForCombo = state.boostHitsLeft;
  let timerVariant = variantForProgress(progress);
  let lastSeconds = seconds;

  const applyUpdate = (next: Readonly<GameState>): void => {
    if (next.score !== prevScore) {
      scoreEl.textContent = String(next.score).padStart(MOBILE_SCORE_DIGITS, '0');
      prevScore = next.score;
    }
    if (next.lives !== prevLives) {
      const updated = renderLives(next.lives, next.config.initialLives);
      livesEl.replaceWith(updated);
      livesEl = updated;
      prevLives = next.lives;
    }
    if (next.level !== prevLevel) {
      levelValueEl.textContent = String(next.level);
      prevLevel = next.level;
    }
    const comboIncremented = next.combo > prevCombo;
    if (next.combo !== prevCombo || next.boostHitsLeft !== prevBoostForCombo) {
      const boosted = next.boostHitsLeft > 0;
      const displayMultiplier = boosted ? 2 : Math.max(1, next.combo);
      comboValueEl.textContent = `×${displayMultiplier}`;
      const updatedDots = renderComboDots(next.combo, boosted);
      comboDotsEl.replaceWith(updatedDots);
      comboDotsEl = updatedDots;
      const active = boosted || next.combo >= 2;
      comboBox.classList.toggle('mobile-hud__combo--active', active);
      if (comboIncremented) playPulse(comboValueEl);
      prevBoostForCombo = next.boostHitsLeft;
      prevCombo = next.combo;
    }
    const p = Math.max(0, Math.min(1, next.timeLeftMs / next.config.gameDurationMs));
    timerBar.fillEl.style.width = `${(p * 100).toFixed(1)}%`;
    const variant = variantForProgress(p);
    if (variant !== timerVariant) {
      timerBar.fillEl.classList.remove(`timer-bar__fill--${timerVariant}`);
      timerBar.fillEl.classList.add(`timer-bar__fill--${variant}`);
      timerVariant = variant;
    }
    const s = Math.ceil(next.timeLeftMs / 1000);
    if (s !== lastSeconds) {
      timerSecondsEl.textContent = `${s}s`;
      lastSeconds = s;
    }
  };

  return { pre: [topBar], post: [quitButton], applyUpdate };
}

function buildPlayfield(holeCount: number): {
  root: HTMLElement;
  cells: HTMLElement[];
  stages: HTMLElement[];
} {
  const cells: HTMLElement[] = [];
  const stages: HTMLElement[] = [];
  const root = el('div', { class: 'playfield' });
  for (let i = 0; i < holeCount; i++) {
    const cell = el('div', { class: 'playfield__cell', 'data-hole': String(i) });
    const stage = el('div', { class: 'playfield__hole-stage' });
    stage.append(renderSandHole());
    cell.append(stage);
    if (i < HOLE_HINT_COUNT) {
      cell.append(el('span', { class: 'playfield__cell-hint' }, [String(i + 1)]));
    }
    cells.push(cell);
    stages.push(stage);
    root.append(cell);
  }
  return { root, cells, stages };
}

export function renderGame(): ScreenInstance {
  const viewport = detectViewport();
  const isMobile = viewport === 'mobile';
  const holeCount = HOLES_BY_VIEWPORT[viewport];
  const config: GameConfig = {
    holeCount,
    initialLives: INITIAL_LIVES,
    gameDurationMs: GAME_DURATION_MS,
  };
  const game = createGame(config);

  const quitButton = renderChunkyButton({
    label: t('game.button.quit'),
    variant: 'secondary',
    onClick: () => {
      setLastGameStats(game.state);
      setScreen('gameover');
    },
  });
  quitButton.classList.add(isMobile ? 'mobile-hud__quit' : 'hud-card--quit');

  const hud = isMobile
    ? buildMobileHud(game.state, quitButton)
    : buildRailsHud(game.state, quitButton);

  const { root: playfield, cells, stages } = buildPlayfield(holeCount);
  const moleNodes = new Map<number, { node: HTMLElement; emerge: Animation | null }>();

  const boostIndicator = el('div', { class: 'boost-indicator' });

  const screenClass = `screen screen-game${isMobile ? ' screen-game--mobile' : ''}`;
  const element = el('section', { class: screenClass }, [
    ...hud.pre,
    playfield,
    ...hud.post,
    boostIndicator,
  ]);

  const handlePointerDown = (event: PointerEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const cell = target.closest<HTMLElement>('[data-hole]');
    if (!cell || !playfield.contains(cell)) return;
    const holeIndex = Number(cell.dataset.hole);
    if (!Number.isInteger(holeIndex)) return;
    const result = game.tap(holeIndex, event.clientX, event.clientY);
    const stage = stages[holeIndex];
    if (!stage) return;
    if (result.outcome === 'hit' && result.points > 0 && result.type !== null) {
      const popupAccent =
        result.type === 'golden' ? 'gold' : result.boosted ? 'primary' : 'success';
      playScorePopup(stage, `+${result.points}`, popupAccent);
      playParticleBurst(stage, particleAccentForType(result.type));
    } else if (result.outcome === 'bomb') {
      playScorePopup(stage, '−1 VIE', 'danger');
      playParticleBurst(stage, 'danger');
      playBombShake(element);
      playBombFlash(element);
    }
  };
  playfield.addEventListener('pointerdown', handlePointerDown);

  let redirecting = false;
  let prevBoost = -1;

  const updateBoostIndicator = (state: Readonly<GameState>): void => {
    if (state.boostHitsLeft === prevBoost) return;
    prevBoost = state.boostHitsLeft;
    if (state.boostHitsLeft > 0) {
      boostIndicator.classList.add('boost-indicator--active');
      boostIndicator.textContent = `×2 boost · ${state.boostHitsLeft} restants`;
    } else {
      boostIndicator.classList.remove('boost-indicator--active');
    }
  };

  const syncMoles = (state: Readonly<GameState>): void => {
    const liveIds = new Set<number>();
    for (const mole of state.activeMoles) {
      liveIds.add(mole.id);
      if (moleNodes.has(mole.id)) continue;
      const cell = cells[mole.holeIndex];
      if (!cell) continue;
      const node = el('div', { class: `playfield__mole playfield__mole--${mole.type}` }, [
        renderMoleByType(mole.type, MOLE_RENDER_SIZE),
      ]);
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
    hud.applyUpdate(state);
    updateBoostIndicator(state);
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
