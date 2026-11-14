/**
 * FAQ accordion on native <details>: one item open at a time, with a smooth
 * height animation (CSS grid 0fr ↔ 1fr). Works without JS (plain <details>).
 */
const DURATION = 450;

export function initAccordion(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-accordion]').forEach((acc) => {
    if (acc.dataset.ready) return;
    acc.dataset.ready = 'true';
    const items = Array.from(acc.querySelectorAll<HTMLDetailsElement>('[data-accordion-item]'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const close = (item: HTMLDetailsElement) => {
      if (!item.open) return;
      if (reduce.matches) {
        item.open = false;
        return;
      }
      item.setAttribute('data-closing', '');
      window.setTimeout(() => {
        item.open = false;
        item.removeAttribute('data-closing');
      }, DURATION);
    };

    const open = (item: HTMLDetailsElement) => {
      items.forEach((other) => other !== item && close(other));
      if (reduce.matches) {
        item.open = true;
        return;
      }
      item.setAttribute('data-opening', '');
      item.open = true;
      requestAnimationFrame(() => requestAnimationFrame(() => item.removeAttribute('data-opening')));
    };

    items.forEach((item) => {
      item.querySelector('summary')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (item.open && !item.hasAttribute('data-closing')) close(item);
        else open(item);
      });
    });
  });
}
