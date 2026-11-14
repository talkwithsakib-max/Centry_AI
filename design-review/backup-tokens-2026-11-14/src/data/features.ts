import { anchors } from '../config/links';

/** The four product features — used by the Features bento AND the nav dropdown. */
export const features = [
  {
    id: 'inbox-scanner',
    name: 'Inbox scanner',
    href: anchors.inboxScanner,
    description:
      'Connects to Gmail or iCloud and finds every subscription receipt: streaming, SaaS, fitness, news, cloud storage and 90+ more.',
  },
  {
    id: 'zombie-detector',
    name: 'Zombie detector',
    href: anchors.zombieDetector,
    description:
      'Scores each subscription by how long it’s been since you used it. The higher the score, the more you’re burning on something you forgot.',
  },
  {
    id: 'spending-dashboard',
    name: 'Spending dashboard',
    href: anchors.spendingDashboard,
    description:
      'Monthly and yearly spend per currency, past vs. upcoming charges, side by side. Switch between 1M, 3M, 6M and 1Y.',
  },
  {
    id: 'cancel-finder',
    name: 'Cancel finder',
    href: anchors.cancelFinder,
    description:
      'One tap opens the exact cancellation page for any service. No settings menus, no support calls. AI finds the direct link.',
  },
] as const;
