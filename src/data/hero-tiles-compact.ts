import type { Brand } from '../components/brand/brands';

/**
 * Floating tiles for the compact hero (< 1024px). Figma has no tablet/mobile
 * frames, so these placements are an approved adaptation: the same brands,
 * rotations and price tags as the desktop scene, moved to the side edges
 * beside the phone so they never sit behind the copy.
 * `bottom` is measured from the hero card's bottom edge.
 */
export interface CompactTile {
  brand: Brand;
  side: 'left' | 'right';
  x: string;
  bottom: number;
  size: number;
  rot: number;
  tag?: string;
  only?: 'tablet' | 'mobile';
}

export const compactTiles: CompactTile[] = [
  // tablet (768–1023)
  { brand: 'netflix', side: 'left', x: '10%', bottom: 300, size: 60, rot: -10, tag: '-$15.99', only: 'tablet' },
  { brand: 'duolingo', side: 'left', x: '3%', bottom: 190, size: 56, rot: 9, only: 'tablet' },
  { brand: 'midjourney', side: 'right', x: '6%', bottom: 300, size: 58, rot: 16, tag: '-$12.99', only: 'tablet' },
  { brand: 'spotify', side: 'right', x: '4%', bottom: 180, size: 54, rot: 12, only: 'tablet' },
  // mobile (< 768)
  { brand: 'duolingo', side: 'left', x: '6%', bottom: 175, size: 40, rot: 9, only: 'mobile' },
  { brand: 'prime-video', side: 'right', x: '6%', bottom: 168, size: 40, rot: -14, only: 'mobile' },
];
