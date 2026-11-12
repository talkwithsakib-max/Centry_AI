/**
 * Hero pile: icons nudge away from the cursor and spring back (user, 2026-11-12;
 * ref. Mobbin — Slush / Wispr Flow icon hovers). Each icon (with its ✕ badge)
 * is pushed along the cursor→icon direction, lifted a little and tilted, using
 * a damped spring so it eases out and settles back naturally.
 *
 * Writes --px / --py / --pr on the elements; HeroScene composes them into the
 * tile's transform (the load-intro keeps using the separate translate/rotate
 * properties, so nothing conflicts). Fine pointers only; off for reduced motion.
 */
const RADIUS = 120; // px on screen: how far the cursor's influence reaches
const PUSH = 30; // px on screen: max sideways shove
const LIFT = 12; // px on screen: max lift
const TILT = 14; // deg: max tilt
const K = 0.11; // spring stiffness
const DAMP = 0.8; // velocity kept per frame

interface Item {
  els: HTMLElement[];
  cx: number; // page coords of the resting centre
  cy: number;
  s: number; // screen px per local px (scene scale)
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  vr: number;
}

export function initPileHover() {
  const scene = document.querySelector<HTMLElement>('[data-hero] .scene');
  if (!scene) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // icons lying below the line: the pile (incl. its side copies) + the three greys
  const items: Item[] = [];
  scene.querySelectorAll<HTMLElement>('.pile > .half.below, .falling > .half.below').forEach((half) => {
    let cur: Item | null = null;
    for (const el of Array.from(half.children) as HTMLElement[]) {
      if (el.classList.contains('badge')) {
        cur?.els.push(el); // a ✕ badge rides with the icon just before it
        continue;
      }
      cur = { els: [el], cx: 0, cy: 0, s: 1, x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 };
      items.push(cur);
    }
  });
  if (!items.length) return;

  const measure = () => {
    // screen px per scene px (the scene is scaled as one unit)
    const s = scene.getBoundingClientRect().width / scene.offsetWidth || 1;
    for (const it of items) {
      const b = it.els[0].getBoundingClientRect();
      // undo the current nudge so we store the resting centre
      it.cx = b.left + b.width / 2 + scrollX - it.x * s;
      it.cy = b.top + b.height / 2 + scrollY - it.y * s;
      it.s = s;
    }
  };

  let px = -1e4;
  let py = -1e4;
  let running = false;
  let ready = false;

  const frame = () => {
    let moving = false;
    for (const it of items) {
      const dx = it.cx - px;
      const dy = it.cy - py;
      const d = Math.hypot(dx, dy);
      let tx = 0;
      let ty = 0;
      let tr = 0;
      if (d < RADIUS) {
        const f = 1 - d / RADIUS;
        const e = f * f * (3 - 2 * f); // smoothstep: soft at the edge, firm near the cursor
        const nx = d ? dx / d : 0;
        const ny = d ? dy / d : -1;
        tx = (nx * PUSH * e) / it.s;
        ty = (ny * PUSH * 0.6 * e - LIFT * e) / it.s;
        tr = (nx >= 0 ? 1 : -1) * TILT * e;
      }
      it.vx = (it.vx + (tx - it.x) * K) * DAMP;
      it.vy = (it.vy + (ty - it.y) * K) * DAMP;
      it.vr = (it.vr + (tr - it.r) * K) * DAMP;
      it.x += it.vx;
      it.y += it.vy;
      it.r += it.vr;
      const live = Math.abs(it.vx) + Math.abs(it.vy) + Math.abs(it.vr) > 0.01 || Math.abs(it.x) + Math.abs(it.y) + Math.abs(it.r) > 0.05;
      if (live) moving = true;
      else if (it.x || it.y || it.r) it.x = it.y = it.r = 0;
      for (const el of it.els) {
        el.style.setProperty('--px', `${it.x.toFixed(2)}px`);
        el.style.setProperty('--py', `${it.y.toFixed(2)}px`);
        el.style.setProperty('--pr', `${it.r.toFixed(2)}deg`);
      }
    }
    if (moving) requestAnimationFrame(frame);
    else running = false;
  };
  const kick = () => {
    if (!running && ready) {
      running = true;
      requestAnimationFrame(frame);
    }
  };

  addEventListener(
    'pointermove',
    (e) => {
      px = e.pageX;
      py = e.pageY;
      kick();
    },
    { passive: true }
  );
  document.documentElement.addEventListener('pointerleave', () => {
    px = py = -1e4;
    kick();
  });
  addEventListener('resize', () => ready && measure(), { passive: true });

  // start once the load intro has landed every icon
  const intro = matchMedia('(min-width: 1024px)').matches ? 3200 : 0;
  setTimeout(() => {
    measure();
    ready = true;
  }, intro);
}
