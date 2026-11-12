/**
 * Light / dark theme switch.
 * - The inline script in BaseLayout sets <html data-theme> before first paint.
 * - A click flips the theme and saves the choice ("centry-theme").
 * - With no saved choice, the page follows OS changes live.
 */
type Theme = 'light' | 'dark';
const KEY = 'centry-theme';
const root = document.documentElement;

const current = (): Theme => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

function saved(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function sync() {
  const dark = current() === 'dark';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    const label = btn.querySelector('[data-theme-label]');
    if (label) label.textContent = dark ? 'Light mode' : 'Dark mode';
  });
  document.querySelector('meta[data-theme-color]')?.setAttribute('content', dark ? '#050506' : '#fefaf7');
}

function apply(theme: Theme) {
  // Switch instantly: suppress component transitions for one frame.
  root.classList.add('theme-switching');
  root.setAttribute('data-theme', theme);
  sync();
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
}

export function initThemeToggle() {
  if (root.dataset.themeInit) return;
  root.dataset.themeInit = '1';
  sync();
  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest('[data-theme-toggle]');
    if (!btn) return;
    const next: Theme = current() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode: the choice lasts for this page only */
    }
    apply(next);
  });
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!saved()) apply(e.matches ? 'dark' : 'light');
  });
}
