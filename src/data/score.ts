/** Zombie score scale (design tokens, 2026-11-14): 0–39 healthy (success / mint),
 *  40–69 warning (amber), 70–100 zombie (coral). */
export type ScoreTone = 'ok' | 'warn' | 'zombie';
export const scoreTone = (n: number): ScoreTone => (n >= 70 ? 'zombie' : n >= 40 ? 'warn' : 'ok');
export const scoreColor = (n: number) =>
  ({ ok: 'var(--color-success)', warn: 'var(--color-warning)', zombie: 'var(--color-zombie)' })[scoreTone(n)];
