import { readFile, writeFile } from 'node:fs/promises';
const d = JSON.parse(await readFile('tools/hero-export.json', 'utf8'));
const key = (n) => n.toLowerCase().replace(' max', '-max').replace(' video', '-video');
const parse = (s) => { const [name, comp, cx, cy, w, h, rot, op, text] = s.split('|'); return { name, comp, cx: +cx, cy: +cy, w: +w, h: +h, rot: +rot, op: +op, text }; };
// Floating: group each tile with the price tag that immediately follows it (Figma "Sub / X" frames)
const floating = [];
for (const s of d.active.map(parse)) {
  if (s.comp === 'Price tag') { floating[floating.length - 1].tag = { cx: s.cx, cy: s.cy, rot: -s.rot, price: s.text }; continue; }
  floating.push({ brand: key(s.name), cx: s.cx, cy: s.cy, rot: -s.rot });
}
const falling = d.falling.map(parse).map((s) => ({ brand: key(s.name), cx: s.cx, cy: s.cy, rot: -s.rot, opacity: s.op }));
const split = d.split.map(([n, cx, cy, r]) => ({ brand: key(n), cx, cy, rot: -r }));
const pile = d.pile.map(parse).map((s) => (s.comp === 'Cancel badge' ? { badge: true, cx: s.cx, cy: s.cy } : { brand: key(s.name), cx: s.cx, cy: s.cy, rot: -s.rot }));
const ts = `/**
 * Hero scene geometry exported from Figma (Hero visual 405:1536) by script.
 * cx/cy = tile centre in the 1424×1008 hero card; rot = CSS degrees (clockwise).
 * Tiles are 64px (Sub tile instances scaled to 0.64). Order = Figma z-order.
 * DO NOT hand-edit — regenerate with tools/gen-hero-tiles.mjs.
 */
import type { Brand } from '../components/brand/brands';

export interface FloatingTile { brand: Brand; cx: number; cy: number; rot: number; tag?: { cx: number; cy: number; rot: number; price: string } }
export interface FallingTile { brand: Brand; cx: number; cy: number; rot: number; opacity: number }
export interface SplitTile { brand: Brand; cx: number; cy: number; rot: number }
export type PileItem = { brand: Brand; cx: number; cy: number; rot: number; badge?: undefined } | { badge: true; cx: number; cy: number };

export const HERO_W = 1424;
export const HERO_H = 1008;
export const TILE = 64;
/** y of the scan-beam split line in hero coordinates */
export const BEAM_Y = 755;

export const floatingTiles: FloatingTile[] = ${JSON.stringify(floating, null, 1)};

export const splitTiles: SplitTile[] = ${JSON.stringify(split, null, 1)};

export const fallingTiles: FallingTile[] = ${JSON.stringify(falling, null, 1)};

export const pile: PileItem[] = ${JSON.stringify(pile)};
`;
await writeFile('src/data/hero-tiles.ts', ts);
console.log(floating.length, 'floating;', falling.length, 'falling;', pile.length, 'pile items');
