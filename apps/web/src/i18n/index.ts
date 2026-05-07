import fr from './fr.json';

export type TranslationKey = keyof typeof fr;

export function t(key: TranslationKey): string {
  return fr[key];
}
