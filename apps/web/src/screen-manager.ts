import { renderHome } from './screens/home';
import { renderGame } from './screens/game';
import { renderGameOver } from './screens/gameover';

export type ScreenName = 'home' | 'game' | 'gameover';

const renderers: Record<ScreenName, () => HTMLElement> = {
  home: renderHome,
  game: renderGame,
  gameover: renderGameOver,
};

let mountPoint: HTMLElement | null = null;
let current: ScreenName | null = null;

export function initScreens(root: HTMLElement, initial: ScreenName): void {
  mountPoint = root;
  setScreen(initial);
}

export function setScreen(name: ScreenName): void {
  if (!mountPoint) throw new Error('initScreens must be called before setScreen');
  if (current === name) return;
  current = name;
  mountPoint.replaceChildren(renderers[name]());
}

export function getCurrentScreen(): ScreenName | null {
  return current;
}
