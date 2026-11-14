import netflix from '../../assets/icons/brands/netflix.svg?url';
import spotify from '../../assets/icons/brands/spotify.svg?url';
import primeVideo from '../../assets/icons/brands/prime-video.svg?url';
import hbo from '../../assets/icons/brands/hbo.svg?url';
import headspace from '../../assets/icons/brands/headspace.svg?url';
import midjourney from '../../assets/icons/brands/midjourney.svg?url';

export type Brand =
  | 'netflix'
  | 'spotify'
  | 'prime-video'
  | 'hbo-max'
  | 'duolingo'
  | 'headspace'
  | 'midjourney';

export const brandLogos = { netflix, spotify, primeVideo, hbo, headspace, midjourney };

export const brandNames: Record<Brand, string> = {
  netflix: 'Netflix',
  spotify: 'Spotify',
  'prime-video': 'Prime Video',
  'hbo-max': 'HBO Max',
  duolingo: 'Duolingo',
  headspace: 'Headspace',
  midjourney: 'Midjourney',
};

/** Figma "Sub tile" colours: [thickness from, to], [face from, to] */
export const tileColors: Record<Brand, { thick: [string, string]; face: [string, string] }> = {
  netflix: { thick: ['#000', '#000'], face: ['#262626', '#020202'] },
  spotify: { thick: ['#000', '#000'], face: ['#262626', '#060606'] },
  'prime-video': { thick: ['#0753b0', '#05449a'], face: ['#25a6ff', '#0a6bdd'] },
  'hbo-max': { thick: ['#3f0ea3', '#330b88'], face: ['#a642ff', '#5517d2'] },
  duolingo: { thick: ['#3c9300', '#347f00'], face: ['#6cd619', '#4fb800'] },
  headspace: { thick: ['#d8d1ca', '#cbc4bc'], face: ['#ffffff', '#f0ece7'] },
  midjourney: { thick: ['#cfcfcf', '#c2c2c2'], face: ['#ffffff', '#ebebeb'] },
};

/** Flat app-icon backgrounds used inside the phone mock-ups */
export const appIconBg: Record<Brand, string> = {
  netflix: '#000',
  spotify: '#121212',
  'prime-video': '#0f79e8',
  'hbo-max': 'linear-gradient(180deg, #a642ff 0%, #5517d2 100%)',
  duolingo: '#58cc02',
  headspace: '#fff',
  midjourney: '#fff',
};
