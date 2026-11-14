/**
 * iPhone waitlist form.
 *  - Validates the email client-side.
 *  - If no endpoint is configured (config/links.ts → waitlistEndpoint), NOTHING
 *    is sent or stored: the visitor sees a "not connected yet" notice.
 *  - With an endpoint, POSTs { email } and shows the designed success state.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COPY = {
  invalid: 'Enter a valid email address.',
  success: 'Thanks — we’ll email you on launch day.',
  notConnected: 'The iPhone waitlist isn’t open yet. Please check back soon.',
  failed: 'Something went wrong. Please try again.',
};

export function initWaitlist() {
  const form = document.querySelector<HTMLFormElement>('[data-waitlist]');
  const status = document.querySelector<HTMLElement>('[data-waitlist-status]');
  if (!form || !status || form.dataset.ready) return;
  form.dataset.ready = 'true';
  const input = form.querySelector<HTMLInputElement>('input[type="email"]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const endpoint = form.dataset.endpoint || '';

  const say = (text: string, tone: 'error' | 'info' | 'success' | '' = '') => {
    status.textContent = text;
    if (tone) status.dataset.tone = tone;
    else delete status.dataset.tone;
  };

  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true' && EMAIL.test(input.value.trim())) {
      input.removeAttribute('aria-invalid');
      say('');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!EMAIL.test(email)) {
      input.setAttribute('aria-invalid', 'true');
      say(COPY.invalid, 'error');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');

    if (!endpoint) {
      // Placeholder state: no service connected — do not send or keep the address.
      input.value = '';
      say(COPY.notConnected, 'info');
      console.info('[waitlist] No endpoint configured (config/links.ts → waitlistEndpoint). Nothing was sent.');
      return;
    }

    button.disabled = true;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.dataset.state = 'success';
      say(COPY.success, 'success');
    } catch {
      say(COPY.failed, 'error');
    } finally {
      button.disabled = false;
    }
  });
}
