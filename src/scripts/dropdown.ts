/**
 * Accessible disclosure dropdown.
 *  - click / Enter / Space toggles; hover opens with a short delay on fine pointers
 *  - Esc closes and returns focus; click outside or focus leaving closes
 *  - ArrowDown/ArrowUp/Home/End move between items
 */
const OPEN_DELAY = 80;
const CLOSE_DELAY = 160;
const ANIM_MS = 170;

export function initDropdowns(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-dropdown]').forEach((el) => {
    if (el.dataset.ready) return;
    el.dataset.ready = 'true';
    setup(el);
  });
}

function setup(el: HTMLElement) {
  const trigger = el.querySelector<HTMLButtonElement>('[data-dropdown-trigger]')!;
  const panel = el.querySelector<HTMLElement>('[data-dropdown-panel]')!;
  const items = () => Array.from(panel.querySelectorAll<HTMLElement>('[data-dropdown-item]'));
  let timer: number | undefined;
  let hideTimer: number | undefined;

  const isOpen = () => trigger.getAttribute('aria-expanded') === 'true';

  const open = () => {
    window.clearTimeout(hideTimer);
    if (isOpen()) return;
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => panel.setAttribute('data-open', '')));
  };

  const close = (focusTrigger = false) => {
    if (!isOpen()) return;
    trigger.setAttribute('aria-expanded', 'false');
    panel.removeAttribute('data-open');
    hideTimer = window.setTimeout(() => (panel.hidden = true), ANIM_MS);
    if (focusTrigger) trigger.focus();
  };

  trigger.addEventListener('click', () => (isOpen() ? close() : open()));

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open();
      requestAnimationFrame(() => items()[0]?.focus());
    }
  });

  panel.addEventListener('keydown', (e) => {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLElement);
    const move = (n: number) => {
      e.preventDefault();
      list[(n + list.length) % list.length]?.focus();
    };
    if (e.key === 'ArrowDown') move(i + 1);
    else if (e.key === 'ArrowUp') move(i - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(list.length - 1);
  });

  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      e.stopPropagation();
      close(true);
    }
  });

  el.addEventListener('focusout', (e) => {
    const next = e.relatedTarget as Node | null;
    if (next && !el.contains(next)) close();
  });

  document.addEventListener('pointerdown', (e) => {
    if (isOpen() && !el.contains(e.target as Node)) close();
  });

  panel.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-dropdown-item]')) close();
  });

  // Hover intent — only for devices with a real hover-capable pointer.
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  el.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse' || !canHover.matches) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(open, OPEN_DELAY);
  });
  el.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse' || !canHover.matches) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!el.contains(document.activeElement)) close();
    }, CLOSE_DELAY);
  });
}
