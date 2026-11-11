/**
 * Accessible tabs (WAI-ARIA tablist). Each [data-tab=i] shows every
 * [data-panel=i] inside the same [data-tabs] root (phone screen + detail).
 * Arrow keys / Home / End move between tabs; activation follows focus.
 *
 * Smooth switch (user, 2026-11-10): the old phone screen cross-fades out on top
 * while the new screen's content rises in from top to bottom (each item / list
 * row in turn); the detail text staggers in beside it. Reduced motion → instant.
 */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Items of a phone screen in reading order: top-level pieces, with list cards split into rows. */
function screenItems(panel: HTMLElement) {
  const scr = panel.querySelector<HTMLElement>('.scr');
  if (!scr) return [];
  const items: HTMLElement[] = [];
  for (const el of Array.from(scr.children) as HTMLElement[]) {
    const rows = el.classList.contains('row-card') ? (Array.from(el.children) as HTMLElement[]) : [];
    if (rows.length > 1) {
      items.push(el, ...rows);
    } else {
      items.push(el);
    }
  }
  const top = scr.getBoundingClientRect().top;
  return items.map((el) => ({ el, y: el.getBoundingClientRect().top - top, row: el.parentElement !== scr }));
}

function animateScreenIn(panel: HTMLElement) {
  const items = screenItems(panel);
  const h = panel.getBoundingClientRect().height || 1;
  for (const { el, y, row } of items) {
    el.getAnimations().forEach((a) => a.cancel());
    // a list card itself only fades (its rows rise inside it)
    const isCard = el.classList.contains('row-card') && el.children.length > 1;
    const delay = 120 + Math.max(0, Math.min(1, y / h)) * 360;
    el.animate(
      isCard
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, translate: `0 ${row ? 8 : 12}px` },
            { opacity: 1, translate: '0 0' },
          ],
      { duration: isCard ? 320 : 520, delay, easing: EASE, fill: 'backwards' },
    );
  }
}

function animateDetailIn(panel: HTMLElement) {
  (Array.from(panel.children) as HTMLElement[]).forEach((el, k) => {
    el.getAnimations().forEach((a) => a.cancel());
    el.animate(
      [
        { opacity: 0, translate: '0 14px' },
        { opacity: 1, translate: '0 0' },
      ],
      { duration: 560, delay: 40 + k * 60, easing: EASE, fill: 'backwards' },
    );
  });
}

export function initTabs(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-tabs]').forEach((box) => {
    if (box.dataset.ready) return;
    box.dataset.ready = 'true';
    const tabs = Array.from(box.querySelectorAll<HTMLButtonElement>('[role="tab"][data-tab]'));
    const panels = Array.from(box.querySelectorAll<HTMLElement>('[data-panel]'));
    let current = Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'));

    const select = (i: number, focus = false) => {
      tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      tabs[i]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      if (i === current) return;
      const prev = current;
      current = i;
      const motion = !reduced();

      panels.forEach((p) => {
        const n = Number(p.dataset.panel);
        const isScreen = p.classList.contains('screen');
        p.getAnimations().forEach((a) => a.cancel());
        if (n === i) {
          p.hidden = false;
          p.style.zIndex = '';
          if (motion) (isScreen ? animateScreenIn : animateDetailIn)(p);
        } else if (n === prev && isScreen && motion) {
          // old phone screen stays on top and fades away over the new one
          p.hidden = false;
          p.style.zIndex = '1';
          const out = p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'ease-out', fill: 'forwards' });
          out.onfinish = () => {
            if (current !== n) p.hidden = true;
            p.style.zIndex = '';
            out.cancel();
          };
        } else {
          p.hidden = true;
          p.style.zIndex = '';
        }
      });
    };

    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const last = tabs.length - 1;
        const map: Record<string, number> = {
          ArrowDown: i === last ? 0 : i + 1,
          ArrowRight: i === last ? 0 : i + 1,
          ArrowUp: i === 0 ? last : i - 1,
          ArrowLeft: i === 0 ? last : i - 1,
          Home: 0,
          End: last,
        };
        if (e.key in map) {
          e.preventDefault();
          select(map[e.key], true);
        }
      });
    });
  });
}
