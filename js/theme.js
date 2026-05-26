/* =========================================================
   Ant White — Portfolio
   Theme toggle. Reads/writes localStorage; updates the
   <html data-theme> attribute. The "set theme before paint"
   bit must run inline in each page's <head>; see how each
   HTML file calls the helper below.
   --------------------------------------------------------
   States:
     localStorage 'aw_theme' = 'dark' | 'light' | absent
     <html data-theme>       = 'dark' | 'light' | absent
   When absent, OS prefers-color-scheme decides.
   ========================================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'aw_theme';

  function applyTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function readStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      if (theme) {
        localStorage.setItem(STORAGE_KEY, theme);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // localStorage might be blocked — fail silently
    }
  }

  function effectiveTheme() {
    // What theme is *visually* in effect right now?
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark' || explicit === 'light') return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Expose the apply function so the inline-head script can use it
  window.awApplyTheme = applyTheme;

  // Wire up the toggle button once the DOM is ready and the
  // header partial has loaded
  function wireToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return false;

    // Reflect current state
    const current = effectiveTheme();
    btn.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');

    btn.addEventListener('click', function () {
      const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
      btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    });

    return true;
  }

  // The header is loaded via includes.js, so the toggle button
  // doesn't exist at DOMContentLoaded. Retry until it does (up
  // to a few seconds) or give up gracefully.
  function tryWire(attempts) {
    if (wireToggle()) return;
    if (attempts <= 0) return;
    setTimeout(function () { tryWire(attempts - 1); }, 50);
  }

  document.addEventListener('DOMContentLoaded', function () {
    tryWire(40); // ~2 seconds of retries
  });
})();
