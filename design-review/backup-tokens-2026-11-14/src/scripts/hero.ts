/**
 * Hero helpers:
 *  - keeps --hs (card width / 1424) in sync so the scene scales as one unit
 *  - pauses the hero loops while it is off-screen
 */
export function initHeroScale() {
  const wrap = document.querySelector<HTMLElement>('[data-hero]');
  const card = wrap?.querySelector<HTMLElement>('.hero-card');
  if (!wrap || !card) return;

  const update = () => {
    const w = card.getBoundingClientRect().width;
    const hs = Math.min(1, w / 1424);
    wrap.style.setProperty('--hs', String(hs));
    // extra stage width each side when the card is wider than the 1424px design
    wrap.style.setProperty('--bleed', `${Math.max(0, (w / hs - 1424) / 2)}px`);
  };
  new ResizeObserver(update).observe(card);
  update();

  new IntersectionObserver(
    ([entry]) => (wrap.dataset.motion = entry.isIntersecting ? 'running' : 'paused'),
    { rootMargin: '100px' }
  ).observe(wrap);
}
