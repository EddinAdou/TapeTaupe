import { el } from '../dom';

type Variant = 'primary' | 'secondary';

interface ChunkyButtonOpts {
  label: string;
  variant?: Variant;
  icon?: Element | null;
  onClick?: () => void;
  ariaLabel?: string;
}

export function renderChunkyButton(opts: ChunkyButtonOpts): HTMLButtonElement {
  const variant = opts.variant ?? 'primary';
  const children: (Node | string)[] = [];
  if (opts.icon) children.push(opts.icon);
  children.push(opts.label);

  const attrs: Record<string, string | number | boolean | EventListener> = {
    class: `chunky-button chunky-button--${variant}`,
    type: 'button',
    'aria-label': opts.ariaLabel ?? opts.label,
  };
  if (opts.onClick) attrs.onClick = opts.onClick;

  return el('button', attrs, children);
}

export function renderPlayTriangle(size = 22): SVGSVGElement {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `<path d="M6 4.5 L20 12 L6 19.5 Z" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />`;
  return svg;
}
