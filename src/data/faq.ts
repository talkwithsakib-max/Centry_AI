/** FAQ content — from the Figma "FAQ item" instances (448:8303); three answers aligned with
 *  the Privacy section and the pricing table on 2026-11-14. */
export const faq = [
  {
    q: 'How does CentryAI detect my subscriptions?',
    a: 'CentryAI scans your Gmail or iCloud receipts with read-only access, reading only billing and receipt emails to find recurring charges. You can also add or edit any subscription manually.',
  },
  {
    q: 'What are “zombie” subscriptions?',
    a: 'Services you keep paying for but haven’t used in over 30 days. CentryAI gives every subscription a zombie score, so you can see which ones are quietly costing you money.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. CentryAI uses read-only access to your inbox, so it can’t send, delete or change an email. Your email content is never stored on our servers or used to train AI, and there’s no bank linking: CentryAI never asks for your bank details.',
  },
  {
    q: 'Can CentryAI cancel subscriptions for me?',
    a: 'CentryAI finds the fastest way to cancel each service: a direct cancel link, a phone number or step-by-step instructions. One-tap cancellation is coming in v2.',
  },
  {
    q: 'Does it work with family sharing plans?',
    a: 'Yes. CentryAI detects shared and split-cost plans and shows you the per-person cost for each family subscription.',
  },
  {
    q: 'Is CentryAI free?',
    a: 'Yes, the Free plan is free forever: track up to 3 subscriptions with manual entry and a renewal calendar. Pro ($7.99/month, 7-day free trial) unlocks unlimited subscriptions, the AI email scanner, zombie scores and alerts, spending analytics, the AI cancel finder and email renewal reminders.',
  },
];
