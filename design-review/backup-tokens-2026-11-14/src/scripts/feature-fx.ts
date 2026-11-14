/**
 * Features bento: each tile plays its intro once, when it scrolls into view
 * (user, 2026-11-09). Arming ([data-fx]) holds the CSS animations in
 * FeatureVisuals.astro at their first frame; [data-fx='play'] runs them, and the
 * numbers ([data-count]) count up alongside. Reduced motion / no JS → static.
 */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function render(el: HTMLElement, v: number) {
  const target = Number(el.dataset.count);
  const fmt = el.dataset.format ?? '{n}';
  if (fmt.includes('{dec}')) {
    const [int, dec] = v.toFixed(2).split('.');
    el.innerHTML = fmt.replace('{int}', int).replace('{dec}', dec);
  } else {
    const n = Math.round(v).toLocaleString('en-US');
    el.textContent = fmt.replace('{n}', n);
  }
  return target;
}

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  const at = Number(el.dataset.at ?? 0) * 1000;
  const dur = Number(el.dataset.for ?? 1) * 1000;
  let start = 0;
  const step = (now: number) => {
    if (!start) start = now + at;
    const t = Math.min(1, Math.max(0, (now - start) / dur));
    render(el, target * easeOut(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initFeatureFx() {
  const tiles = [...document.querySelectorAll<HTMLElement>('#features .grid > .tile')];
  if (!tiles.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const tile = e.target as HTMLElement;
        io.unobserve(tile);
        tile.dataset.fx = 'play';
        tile.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
      }
    },
    { threshold: 0.4 },
  );
  for (const tile of tiles) {
    tile.dataset.fx = '';
    tile.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => render(el, 0));
    io.observe(tile);
  }
}
