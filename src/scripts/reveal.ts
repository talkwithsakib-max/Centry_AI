/**
 * Site-wide motion helpers (user brief, 2026-11-10).
 *
 * - [data-reveal]: a section/group. When it scrolls into view it gets .is-in once;
 *   descendants marked [data-r] (up | scale | left | fade) then animate in with
 *   their --rd delay (CSS in global.css). It also toggles .in-view continuously so
 *   looping decorations (.fx-loop) pause off-screen, and fires a 'reveal' event.
 * - [data-count]: numbers that count up from zero when their group reveals.
 *     data-count="86.94" data-format="${int}.{dec}/mo" data-at="0.4" data-for="1.2"
 *     ({n} = whole number with separators; {int}/{dec} = 2-decimal money)
 *   Elements inside [data-count-manual] are left for their section's own script.
 * - [data-magnetic]: buttons drift a few px toward a fine pointer.
 * The page gets html.fx from the inline head script only when motion is allowed;
 * without it (reduced motion / no JS) everything shows statically.
 */
const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3);

export function renderCount(el: HTMLElement, v: number) {
  const fmt = el.dataset.format ?? '{n}';
  if (fmt.includes('{dec}')) {
    const [int, dec] = v.toFixed(2).split('.');
    el.textContent = fmt.replace('{int}', Number(int).toLocaleString('en-US')).replace('{dec}', dec);
  } else {
    el.textContent = fmt.replace('{n}', Math.round(v).toLocaleString('en-US'));
  }
}

/** Count [data-count] from 0 to its value; `extraDelay` (s) is added to data-at. */
export function countUp(el: HTMLElement, extraDelay = 0) {
  const target = Number(el.dataset.count);
  const at = (Number(el.dataset.at ?? 0) + extraDelay) * 1000;
  const dur = Number(el.dataset.for ?? 1.2) * 1000;
  const token = (el.dataset.countRun = String(Number(el.dataset.countRun ?? 0) + 1));
  renderCount(el, 0);
  let start = 0;
  const step = (now: number) => {
    if (el.dataset.countRun !== token) return; // restarted elsewhere
    if (!start) start = now + at;
    const t = Math.min(1, Math.max(0, (now - start) / dur));
    renderCount(el, target * EASE_OUT(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const motionOn = () => document.documentElement.classList.contains('fx');

function initReveal() {
  const groups = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  // numbers start at zero until their group reveals
  groups.forEach((g) =>
    g.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      if (!el.closest('[data-count-manual]')) renderCount(el, 0);
    }),
  );

  const once = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const g = e.target as HTMLElement;
        once.unobserve(g);
        g.classList.add('is-in');
        g.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
          if (!el.closest('[data-count-manual]')) countUp(el);
        });
        g.dispatchEvent(new CustomEvent('reveal'));
      }
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
  );
  const live = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('in-view', e.isIntersecting)),
    { rootMargin: '80px' },
  );
  groups.forEach((g) => {
    once.observe(g);
    live.observe(g);
  });
}

function initMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const STRENGTH = 0.18; // fraction of the pointer offset
  const MAX = 6; // px
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) raf = requestAnimationFrame(tick);
      else {
        raf = 0;
        if (!tx && !ty) el.style.translate = '';
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));
      tx = clamp((e.clientX - (r.left + r.width / 2)) * STRENGTH);
      ty = clamp((e.clientY - (r.top + r.height / 2)) * STRENGTH);
      kick();
    });
    el.addEventListener('pointerleave', () => {
      tx = 0;
      ty = 0;
      kick();
    });
  });
}

export function initMotion() {
  (window as unknown as { __fxReady?: boolean }).__fxReady = true;
  if (!motionOn()) return;
  initReveal();
  initMagnetic();
}
