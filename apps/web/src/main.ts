import './styles/reset.css';
import './styles/tokens.css';
import './styles/typography.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <h1 class="font-display text-display-l">TAPETAUPE</h1>
    <p class="text-body">Phase 1.1 — design tokens loaded</p>
  `;
}
