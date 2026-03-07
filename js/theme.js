// Theme toggle — persists to localStorage, respects system preference
(function () {
  const STORAGE_KEY = 'sdu-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK || stored === LIGHT) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      // Moon for light mode (click to go dark), Sun for dark mode (click to go light)
      btn.textContent = theme === DARK ? '\u2600' : '\u263E';
      btn.setAttribute('aria-label', theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Apply immediately to prevent flash
  apply(getPreferred());

  document.addEventListener('DOMContentLoaded', function () {
    // Re-apply after DOM ready to update button
    apply(getPreferred());

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || LIGHT;
        var next = current === DARK ? LIGHT : DARK;
        localStorage.setItem(STORAGE_KEY, next);
        apply(next);
      });
    }
  });
})();
