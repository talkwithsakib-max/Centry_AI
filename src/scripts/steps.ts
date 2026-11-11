/**
 * How it works: exactly one step card is open.
 * Click (or Enter/Space on the card button) opens a card and closes the open one,
 * Calendly-style; on devices with a fine hover pointer (desktop layout), hovering a
 * collapsed card opens it too. The animation itself is CSS in HowItWorks.astro.
 * In the stacked layout the open card's height follows its content.
 */
import { countUp } from './reveal';

export function initSteps() {
  const root = document.querySelector<HTMLElement>('[data-steps]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
  const stacked = window.matchMedia('(max-width: 1023px)');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let hoverTimer: number | undefined;

  const measure = () => {
    cards.forEach((card) => {
      const visual = card.querySelector<HTMLElement>('.visual');
      if (!visual) return;
      // visual offset (below title + description) + visual + 16px bottom padding
      card.style.setProperty('--open-h', `${visual.offsetTop + visual.offsetHeight + 16}px`);
    });
  };

  // mock pieces enter top to bottom: --row from their vertical position
  cards.forEach((card) =>
    card.querySelectorAll<HTMLElement>('.mock > *').forEach((el) => {
      el.style.setProperty('--row', String(Math.round(el.offsetTop / 24)));
    }),
  );
  const section = root.closest<HTMLElement>('[data-reveal]');
  const counts = (card: HTMLElement) => {
    if (!document.documentElement.classList.contains('fx')) return;
    if (section && !section.classList.contains('is-in')) return;
    card.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => countUp(el));
  };
  section?.addEventListener('reveal', () => {
    const on = cards.find((c) => c.hasAttribute('data-open'));
    if (on) counts(on);
  });

  const open = (target: HTMLElement) => {
    if (target.hasAttribute('data-open')) return;
    counts(target);
    cards.forEach((card) => {
      const on = card === target;
      card.toggleAttribute('data-open', on);
      card.querySelector('[data-step-trigger]')?.setAttribute('aria-expanded', String(on));
    });
  };

  cards.forEach((card) => {
    card.querySelector('[data-step-trigger]')?.addEventListener('click', () => open(card));
    card.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !canHover.matches || stacked.matches) return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => open(card), 120);
    });
    card.addEventListener('pointerleave', () => window.clearTimeout(hoverTimer));
  });

  new ResizeObserver(measure).observe(root);
  measure();
}
