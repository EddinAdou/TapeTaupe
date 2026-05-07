import { renderChunkyButton, renderPlayTriangle } from '../components/chunky-button';
import { renderLogo } from '../components/logo';
import { renderStatCard } from '../components/stat-card';
import { el } from '../dom';
import { t } from '../i18n';
import { renderStandardMole } from '../scene/characters';
import { renderSandHole } from '../scene/sand-hole';
import { setScreen } from '../screen-manager';

export function renderHome(): HTMLElement {
  return el('section', { class: 'screen screen-home' }, [
    el('div', { class: 'home__topbar' }, [
      el('div', { class: 'glass-card home__version' }, [
        el('span', { class: 'caption' }, [t('home.version')]),
      ]),
    ]),

    el('div', { class: 'home__hero' }, [
      renderLogo(),
      el('p', { class: 'home__tagline' }, [
        t('home.tagline.line1'),
        el('br', {}, []),
        t('home.tagline.line2'),
        ' ',
        el('span', { class: 'home__tagline-duration' }, [t('home.tagline.duration')]),
      ]),
      el('div', { class: 'home__mascot' }, [
        renderSandHole(220, 100),
        el('div', { class: 'home__mascot-mole' }, [renderStandardMole(140)]),
      ]),
    ]),

    el('div', { class: 'home__stats' }, [
      renderStatCard(t('home.stat.bestScore'), '0', 'primary'),
      renderStatCard(t('home.stat.totalGames'), '0'),
    ]),

    el('div', { class: 'home__ctas' }, [
      renderChunkyButton({
        label: t('home.button.play'),
        variant: 'primary',
        icon: renderPlayTriangle(22),
        onClick: () => setScreen('game'),
      }),
      renderChunkyButton({
        label: t('home.button.howto'),
        variant: 'secondary',
      }),
    ]),
  ]);
}
