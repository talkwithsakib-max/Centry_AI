/**
 * Pricing content (Figma "Pricing" 499:15677).
 *
 * Annual billing is intentionally OFF until real annual prices are provided.
 * While disabled, the Monthly/Annual toggle and the "Save 37% with annual
 * billing" line are not rendered (the line's space is kept so the two plan
 * buttons stay level, as in Figma). Do not invent annual prices.
 */
export const annualBilling = {
  enabled: false,
  // Fill these in when confirmed, then set enabled: true.
  pro: { price: null as string | null, period: null as string | null },
  savingsLabel: 'Save 37%',
};

export const plans = {
  free: {
    name: 'Free',
    tagline: 'Get organized. Track up to 3 subscriptions.',
    price: '$0',
    period: 'forever',
    note: 'No card. No trial clock.',
    cta: 'Download free',
    listTitle: 'Includes',
    features: ['Up to 3 subscriptions', 'Manual entry & editing', 'Renewal calendar', 'Dark & light theme'],
  },
  pro: {
    name: 'Pro',
    badge: 'Most popular',
    tagline: 'Find every zombie and cut it in a tap.',
    price: '$7.99',
    period: '/ month',
    cta: 'Start 7-day free trial',
    listTitle: 'Everything in Free, plus',
    features: [
      'Unlimited subscriptions',
      'AI email scanner',
      'Zombie scores & alerts',
      'Spending analytics',
      'AI cancel finder',
      'Email renewal reminders',
      'Priority support',
    ],
  },
} as const;

export const trust = ['7-day free trial', 'No credit card to start', 'Cancel anytime', 'Prices may vary by region'];
