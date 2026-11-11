/** Compact navigation sheet: toggle, Esc, outside click, close on link. */
const ANIM_MS = 210;

export function initMobileMenu() {
  const root = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';

  const toggle = root.querySelector<HTMLButtonElement>('[data-mm-toggle]')!;
  const sheet = root.querySelector<HTMLElement>('[data-mm-sheet]')!;
  const subToggle = root.querySelector<HTMLButtonElement>('[data-mm-sub]');
  const subPanel = root.querySelector<HTMLElement>('[data-mm-subpanel]');
  let hideTimer: number | undefined;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const open = () => {
    window.clearTimeout(hideTimer);
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    sheet.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.setAttribute('data-open', '')));
  };
  const close = (focusToggle = false) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    sheet.removeAttribute('data-open');
    hideTimer = window.setTimeout(() => (sheet.hidden = true), ANIM_MS);
    if (focusToggle) toggle.focus();
  };

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));

  subToggle?.addEventListener('click', () => {
    const expanded = subToggle.getAttribute('aria-expanded') === 'true';
    subToggle.setAttribute('aria-expanded', String(!expanded));
    subPanel?.toggleAttribute('data-open', !expanded);
  });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close(true);
  });
  document.addEventListener('pointerdown', (e) => {
    if (isOpen() && !root.closest('nav')?.contains(e.target as Node)) close();
  });
  root.querySelectorAll('[data-mm-link]').forEach((a) => a.addEventListener('click', () => close()));

  // If the viewport grows past the compact breakpoint, reset.
  window.matchMedia('(min-width: 900px)').addEventListener('change', (mq) => {
    if (mq.matches && isOpen()) close();
  });
}
