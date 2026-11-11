/** FAQ content — taken verbatim from the Figma "FAQ item" instances (448:8303). */
export const faq = [
  {
    q: 'How does CentryAI detect my subscriptions?',
    a: 'CentryAI connects to Gmail or iCloud with read-only access and reads only receipts and billing emails to find recurring charges. You can also add or edit subscriptions manually at any time.',
  },
  {
    q: 'What are “zombie” subscriptions?',
    a: 'Services you keep paying for but haven’t used in over 30 days. CentryAI gives every subscription a zombie score, so you can see which ones are quietly costing you money.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. CentryAI never connects to your bank account, never stores your email content and never uses your data to train AI models. Your data is encrypted and stays on your device by default.',
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
    a: 'The core tracking features are free for up to 3 subscriptions. CentryAI Pro unlocks unlimited tracking, the AI email scanner, zombie detection, analytics and renewal alerts.',
  },
];
