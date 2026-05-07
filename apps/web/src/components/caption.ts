import { el } from '../dom';

export function renderCaption(text: string): HTMLElement {
  return el('span', { class: 'caption' }, [text]);
}
