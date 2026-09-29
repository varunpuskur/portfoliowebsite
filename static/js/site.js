// Small shared actions. Links and navigation use normal browser behavior.
(() => {
  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  const copy = document.querySelector('[data-copy-email]');
  copy?.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    const label = copy.querySelector('span');
    const email = document.querySelector('.email-link').textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      label.textContent = 'Email copied';
      status.textContent = 'Copied to clipboard.';
      setTimeout(() => { label.textContent = 'Copy email'; status.textContent = ''; }, 2500);
    } catch {
      status.textContent = 'Please select and copy the email address above.';
    }
  });
})();
