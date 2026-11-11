/**
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

export const floatingTiles: FloatingTile[] = [
 {
  "brand": "prime-video",
  "cx": 118,
  "cy": 214,
  "rot": 14
 },
 {
  "brand": "netflix",
  "cx": 250,
  "cy": 334,
  "rot": -10,
  "tag": {
   "cx": 276.9,
   "cy": 363.4,
   "rot": 11,
   "price": "-$15.99"
  }
 },
 {
  "brand": "duolingo",
  "cx": 92,
  "cy": 468,
  "rot": 9
 },
 {
  "brand": "hbo-max",
  "cx": 338,
  "cy": 516,
  "rot": -14,
  "tag": {
   "cx": 364.9,
   "cy": 545.4,
   "rot": 11,
   "price": "-$12.99"
  }
 },
 {
  "brand": "headspace",
  "cx": 476,
  "cy": 548,
  "rot": 18
 },
 {
  "brand": "spotify",
  "cx": 214,
  "cy": 588,
  "rot": -22
 },
 {
  "brand": "spotify",
  "cx": 1300,
  "cy": 206,
  "rot": -12,
  "tag": {
   "cx": 1326.9,
   "cy": 235.4,
   "rot": 11,
   "price": "-$10.99"
  }
 },
 {
  "brand": "hbo-max",
  "cx": 1168,
  "cy": 326,
  "rot": 10
 },
 {
  "brand": "midjourney",
  "cx": 1340,
  "cy": 452,
  "rot": -16,
  "tag": {
   "cx": 1366.9,
   "cy": 481.4,
   "rot": 11,
   "price": "-$12.99"
  }
 },
 {
  "brand": "duolingo",
  "cx": 1094,
  "cy": 506,
  "rot": -9,
  "tag": {
   "cx": 1120.9,
   "cy": 535.4,
   "rot": 11,
   "price": "-$10.99"
  }
 },
 {
  "brand": "prime-video",
  "cx": 958,
  "cy": 554,
  "rot": -20
 },
 {
  "brand": "netflix",
  "cx": 1262,
  "cy": 594,
  "rot": 20
 },
 {
  "brand": "headspace",
  "cx": 66,
  "cy": 96,
  "rot": -12
 },
 {
  "brand": "midjourney",
  "cx": 1378,
  "cy": 92,
  "rot": 12
 }
];

export const splitTiles: SplitTile[] = [
 {
  "brand": "netflix",
  "cx": 430,
  "cy": 751,
  "rot": -28
 },
 {
  "brand": "hbo-max",
  "cx": 1004,
  "cy": 751,
  "rot": 24
 }
];

export const fallingTiles: FallingTile[] = [
 {
  "brand": "spotify",
  "cx": 149.1,
  "cy": 849.1,
  "rot": -30,
  "opacity": 0.92
 },
 {
  "brand": "netflix",
  "cx": 1295.6,
  "cy": 831.6,
  "rot": -28,
  "opacity": 0.92
 },
 {
  "brand": "midjourney",
  "cx": 486,
  "cy": 926,
  "rot": 16,
  "opacity": 0.92
 }
];

export const pile: PileItem[] = [{"brand":"prime-video","cx":966,"cy":995,"rot":13.2},{"brand":"spotify","cx":370.7,"cy":994.9,"rot":22.4},{"brand":"midjourney","cx":201.7,"cy":994.7,"rot":-18.2},{"brand":"hbo-max","cx":44.4,"cy":994.7,"rot":10.8},{"brand":"netflix","cx":1072.5,"cy":993.1,"rot":-5.6},{"brand":"prime-video","cx":860.7,"cy":992.8,"rot":14.6},{"brand":"midjourney","cx":1017.4,"cy":992.4,"rot":-6.8},{"brand":"prime-video","cx":426.5,"cy":992.4,"rot":-12.2},{"brand":"netflix","cx":259,"cy":992.4,"rot":-23.3},{"brand":"hbo-max","cx":539.5,"cy":991.9,"rot":8.8},{"brand":"netflix","cx":1181.8,"cy":991.6,"rot":33.9},{"brand":"headspace","cx":1293.8,"cy":991.5,"rot":-20.2},{"brand":"spotify","cx":1123,"cy":990.7,"rot":18.2},{"brand":"midjourney","cx":1235.8,"cy":989.8,"rot":-31.1},{"brand":"spotify","cx":913.7,"cy":989,"rot":-24.6},{"brand":"midjourney","cx":1398.1,"cy":988.3,"rot":34.6},{"brand":"headspace","cx":145.7,"cy":987.9,"rot":5.5},{"brand":"duolingo","cx":1349.3,"cy":987.6,"rot":32.3},{"brand":"prime-video","cx":315.6,"cy":987.2,"rot":-10.9},{"brand":"netflix","cx":93.8,"cy":985.9,"rot":-11.5},{"brand":"netflix","cx":481.8,"cy":985.4,"rot":-23.4},{"brand":"netflix","cx":18,"cy":961.8,"rot":3.5},{"brand":"midjourney","cx":1413.6,"cy":961.8,"rot":1.5},{"brand":"prime-video","cx":1037.8,"cy":961.5,"rot":-15.6},{"brand":"prime-video","cx":352.1,"cy":960.8,"rot":23.8},{"brand":"midjourney","cx":1198.8,"cy":960.4,"rot":12.5},{"badge":true,"cx":1220.6,"cy":937.4},{"brand":"netflix","cx":1088.3,"cy":960.2,"rot":-1.6},{"brand":"duolingo","cx":1146.7,"cy":959.7,"rot":15.1},{"brand":"midjourney","cx":1303.7,"cy":959.5,"rot":11.7},{"badge":true,"cx":1325.5,"cy":936.4},{"brand":"netflix","cx":939.2,"cy":959,"rot":-4.1},{"badge":true,"cx":961,"cy":935.9},{"brand":"spotify","cx":462.9,"cy":958.6,"rot":-7.2},{"brand":"spotify","cx":129.9,"cy":958.1,"rot":-32},{"brand":"hbo-max","cx":988.7,"cy":958.1,"rot":-10.1},{"brand":"prime-video","cx":242.8,"cy":957.8,"rot":2},{"badge":true,"cx":264.6,"cy":934.8},{"brand":"duolingo","cx":516.3,"cy":956.8,"rot":-4.6},{"brand":"duolingo","cx":409.4,"cy":956.6,"rot":2.4},{"brand":"prime-video","cx":1355.8,"cy":954.7,"rot":29.5},{"badge":true,"cx":1377.6,"cy":931.6},{"brand":"midjourney","cx":295.2,"cy":953.3,"rot":8.4},{"brand":"headspace","cx":881.2,"cy":952.3,"rot":-30.3},{"brand":"netflix","cx":186,"cy":952.3,"rot":16.1},{"brand":"netflix","cx":1254.6,"cy":952.2,"rot":-33.4},{"brand":"headspace","cx":75.7,"cy":952.2,"rot":-22.2},{"badge":true,"cx":97.5,"cy":929.1},{"brand":"prime-video","cx":142,"cy":928.3,"rot":-7.7},{"brand":"hbo-max","cx":1175.5,"cy":927,"rot":0.3},{"brand":"prime-video","cx":1012.1,"cy":926.8,"rot":7.4},{"brand":"duolingo","cx":1118,"cy":926.2,"rot":26.2},{"brand":"duolingo","cx":1396.1,"cy":926.1,"rot":-18.8},{"brand":"netflix","cx":1233.8,"cy":925.8,"rot":18.9},{"brand":"spotify","cx":89.7,"cy":925.4,"rot":-28.9},{"brand":"netflix","cx":195.1,"cy":924.6,"rot":29.9},{"badge":true,"cx":216.9,"cy":901.5},{"brand":"netflix","cx":39.8,"cy":924.1,"rot":-5.8},{"brand":"headspace","cx":250.9,"cy":923.7,"rot":3.1},{"brand":"hbo-max","cx":1341,"cy":923.5,"rot":-11},{"brand":"netflix","cx":361.8,"cy":921.8,"rot":-12.2},{"brand":"hbo-max","cx":1066.4,"cy":921.4,"rot":11.8},{"badge":true,"cx":1088.2,"cy":898.3},{"brand":"spotify","cx":1283.8,"cy":920.6,"rot":25},{"brand":"duolingo","cx":412.5,"cy":920.3,"rot":-14.7},{"brand":"duolingo","cx":303.6,"cy":919.2,"rot":10.7},{"brand":"netflix","cx":1259.4,"cy":894.2,"rot":25},{"brand":"prime-video","cx":114.8,"cy":892.8,"rot":-6.6},{"brand":"prime-video","cx":1421.3,"cy":891.6,"rot":13.9},{"brand":"duolingo","cx":1364.8,"cy":889.5,"rot":-28.4},{"badge":true,"cx":1386.6,"cy":866.5},{"brand":"midjourney","cx":271.7,"cy":889.3,"rot":-17.4},{"badge":true,"cx":293.4,"cy":866.3},{"brand":"headspace","cx":8.2,"cy":888.7,"rot":19.3},{"brand":"duolingo","cx":65.9,"cy":887.6,"rot":34},{"brand":"hbo-max","cx":165.5,"cy":886.4,"rot":10.9},{"badge":true,"cx":187.2,"cy":863.3},{"brand":"midjourney","cx":1310.6,"cy":886.3,"rot":27.4},{"badge":true,"cx":1332.4,"cy":863.3},{"brand":"prime-video","cx":1207.8,"cy":886.3,"rot":26.1},{"badge":true,"cx":1229.5,"cy":863.3},{"brand":"spotify","cx":219.1,"cy":885.5,"rot":-4.1},{"brand":"hbo-max","cx":1409.1,"cy":860.8,"rot":34.5},{"brand":"spotify","cx":1352.2,"cy":860.7,"rot":31.4},{"badge":true,"cx":1373.9,"cy":837.6},{"brand":"spotify","cx":31.9,"cy":854,"rot":-9.4},{"badge":true,"cx":53.6,"cy":831}];
