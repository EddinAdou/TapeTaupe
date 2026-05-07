import { renderGame } from './screens/game';
import { renderGameOver } from './screens/gameover';
import { renderHome } from './screens/home';

export type ScreenName = 'home' | 'game' | 'gameover';

export interface ScreenInstance {
  element: HTMLElement;
  cleanup?: () => void;
}

const renderers: Record<ScreenName, () => ScreenInstance> = {
  home: renderHome,
  game: renderGame,
  gameover: renderGameOver,
};

let mountPoint: HTMLElement | null = null;
let current: ScreenName | null = null;
let currentCleanup: (() => void) | null = null;

export function initScreens(root: HTMLElement, initial: ScreenName): void {
  mountPoint = root;
  setScreen(initial);
}

export function setScreen(name: ScreenName): void {
  if (!mountPoint) throw new Error('initScreens must be called before setScreen');
  if (current === name) return;

  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  current = name;
  document.body.dataset.screen = name;
  const instance = renderers[name]();
  currentCleanup = instance.cleanup ?? null;
  mountPoint.replaceChildren(instance.element);
}

export function getCurrentScreen(): ScreenName | null {
  return current;
}
