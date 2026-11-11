/**
 * Get the app (final CTA) motion helpers (user brief, 2026-11-10).
 *
 * 1. Scroll pull: as the flat-lay scrolls into view the side tiles drift in
 *    toward the phone. Sets --p (0 → 1) on the [data-attract] stage.
 * 2. One calm sequence (user: no loop — smoother, calmer, professional): the
 *    magnet draws the set into the phone, the newly cancelled tiles settle under
 *    it and a fresh set eases back in. Its CSS animations are held at their first
 *    frame and played when the tiles are actually on screen — every time the
 *    section is scrolled back into view (user, 2026-11-10).
 * No scroll-jacking. Reduced motion → static.
 */
const ONCE = ['set-once', 'trail-once', 'pile-fall', 'appear', 'appear-late', 'halo-once', 'field-in'];
const ENGAGE = 0.62; // play when the stage top is above 62% of the viewport

export function initAttract() {
  const stage = document.querySelector<HTMLElement>('[data-attract]');
  if (!stage || !document.documentElement.classList.contains('fx')) return;
  const box = stage.closest<HTMLElement>('.flat') ?? stage;
  const section = stage.closest<HTMLElement>('[data-reveal]');
  let raf = 0;
  let active = false;
  let seq: Animation[] = [];
  let played = false;

  const update = () => {
    raf = 0;
    const r = box.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when the stage's top meets the viewport bottom, 1 once it's 80% up the screen
    const t = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.8)));
    const p = t * t * (3 - 2 * t); // smoothstep
    stage.style.setProperty('--p', p.toFixed(4));
    if (!played && seq.length && r.top < vh * ENGAGE) {
      played = true;
      seq.forEach((a) => a.play());
    }
  };
  const onScroll = () => {
    if (active && !raf) raf = requestAnimationFrame(update);
  };

  section?.addEventListener('reveal', () => {
    // the animations exist once .is-in applies: hold them on their first frame
    requestAnimationFrame(() => {
      seq = section.getAnimations({ subtree: true }).filter((a) => ONCE.includes((a as CSSAnimation).animationName));
      seq.forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });
      update();
    });
  });

  new IntersectionObserver(
    ([e]) => {
      active = e.isIntersecting;
      if (active) update();
      // left the screen: rewind, so the sequence plays again on the next visit
      else if (played) {
        played = false;
        seq.forEach((a) => {
          a.pause();
          a.currentTime = 0;
        });
      }
    },
    { rootMargin: '200px 0px' },
  ).observe(box);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
