/**
 * Fit-to-width for fixed-size illustrations.
 * Markup: <div class="fit" data-fit-w="588"> <div class="fit-stage">…</div> </div>
 * Sets --fit = min(1, width / data-fit-w) on the container. CSS in global.css.
 */
export function initFit(root: ParentNode = document) {
  const els = root.querySelectorAll<HTMLElement>('[data-fit-w]:not([data-fit-ready])');
  if (!els.length) return;
  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement;
      // --fit-w may be overridden per breakpoint in CSS (e.g. a cropped stage on mobile)
      const cssW = parseFloat(getComputedStyle(el).getPropertyValue('--fit-w'));
      const w = cssW || Number(el.dataset.fitW);
      const max = el.dataset.fitMax ? Number(el.dataset.fitMax) : 1;
      el.style.setProperty('--fit', String(Math.min(max, e.contentRect.width / w)));
    }
  });
  els.forEach((el) => {
    el.dataset.fitReady = '';
    ro.observe(el);
  });
}
