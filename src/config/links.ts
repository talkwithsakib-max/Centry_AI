/**
 * Every link target on the site lives here.
 *
 * Links marked `placeholder: true` have no confirmed destination yet. They
 * render as `href="#"` with `data-placeholder` so they're easy to find.
 * Replace the `href` and remove `placeholder` when the real URL is known.
 *
 * TODO (placeholders):
 *   - downloadApp, googlePlay        → Google Play listing URL
 *   - logIn                          → web app sign-in URL
 *   - contactSupport, support        → support page or mailto:
 *   - feedback                       → feedback form URL
 *   - resources.*                    → 6 article URLs
 *   - privacy, terms, cookies        → legal page URLs
 *
 * The App Store badge has no link on purpose ("Coming soon").
 */

export interface SiteLink {
  label: string;
  href: string;
  placeholder?: boolean;
  /** what the real destination should be, for whoever fills it in */
  todo?: string;
}

const todo = (label: string, note: string): SiteLink => ({
  label,
  href: '#',
  placeholder: true,
  todo: note,
});

/* ---- In-page anchors (section ids) ---- */
export const anchors = {
  top: '#top',
  features: '#features',
  inboxScanner: '#feature-inbox-scanner',
  zombieDetector: '#feature-zombie-detector',
  spendingDashboard: '#feature-spending-dashboard',
  cancelFinder: '#feature-cancel-finder',
  appPreview: '#app-preview',
  howItWorks: '#how-it-works',
  pricing: '#pricing',
  faq: '#faq',
  download: '#download',
} as const;

/* ---- External / not-yet-known destinations ---- */
export const links = {
  downloadApp: todo('Download app', 'Google Play listing URL'),
  googlePlay: todo('Get it on Google Play', 'Google Play listing URL'),
  logIn: todo('Log in', 'Web app sign-in URL'),
  contactSupport: todo('Contact support', 'Support page URL or mailto: address'),
  support: todo('Support', 'Support page URL'),
  feedback: todo('Feedback', 'Feedback form URL'),
  privacy: todo('Privacy', 'Privacy policy URL'),
  privacyPolicy: todo('Privacy policy', 'Privacy policy URL'),
  terms: todo('Terms', 'Terms of use URL'),
  termsOfUse: todo('Terms of use', 'Terms of use URL'),
  cookies: todo('Cookies', 'Cookie policy URL'),
  resources: {
    bestTrackers: todo('Best subscription tracker apps 2026', 'Article URL'),
    audit: todo('How to audit your subscriptions', 'Article URL'),
    cancel: todo('How to cancel subscriptions', 'Article URL'),
    zombies: todo('What are zombie subscriptions?', 'Article URL'),
    rocketMoney: todo('Rocket Money alternative', 'Article URL'),
    noBankLinking: todo('Trackers without bank linking', 'Article URL'),
  },
} as const;

/**
 * iPhone waitlist form endpoint. While null, the form validates input but
 * sends NOTHING and shows a "not connected yet" notice.
 * TODO: set to the form service URL (expects POST with an `email` field).
 */
export const waitlistEndpoint: string | null = null;

/** Spread onto an <a> to get href + placeholder marker. */
export const linkAttrs = (link: SiteLink) => ({
  href: link.href,
  ...(link.placeholder ? { 'data-placeholder': 'true' } : {}),
});
