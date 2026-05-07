import './styles/reset.css';
import './styles/tokens.css';
import './styles/typography.css';
import './styles/screens.css';

import { query } from './dom';
import { initScreens } from './screen-manager';

const root = query<HTMLDivElement>('#app');
initScreens(root, 'home');
