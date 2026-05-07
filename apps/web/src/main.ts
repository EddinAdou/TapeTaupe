import './styles/reset.css';
import './styles/tokens.css';
import './styles/typography.css';
import './styles/scene.css';
import './styles/screens.css';

import { query } from './dom';
import { renderScene } from './scene/tropical-island';
import { initScreens } from './screen-manager';

document.body.prepend(renderScene());

const root = query<HTMLDivElement>('#app');
initScreens(root, 'home');
