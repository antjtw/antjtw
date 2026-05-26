/* =========================================================
   Ant White — Portfolio auth
   --------------------------------------------------------
   This is a soft gate, not real security. The site is
   static, so any client-side check can be bypassed by
   someone determined. The purpose is to filter casual
   visitors and let you control who sees the work.
   --------------------------------------------------------
   How it works:
     - On protected pages: checks for a valid token, redirects
       to /index.html if missing.
     - On the password page: validates input, stores token,
       redirects to /work.html.
     - "Remember me" stores in localStorage (30 days).
     - Otherwise, stored in sessionStorage (cleared on
       browser close).
   --------------------------------------------------------
   Changing the password:
     Replace PASSWORD_HASH below with a SHA-256 hash of your
     new password. Generate one in the browser console:
       await hashPassword('your-new-password')
   ========================================================= */

(function () {
  'use strict';

  // SHA-256 of "please-hire-me"
  // To change: run hashPassword('your-password') in the
  // browser console on the password page and paste the
  // result below.
  const PASSWORD_HASH = '25fc1c8583383173ed7d6267b24f98171d5072ca3c86939ff04a7baec4f9ea86';

  const STORAGE_KEY = 'aw_auth';
  const REMEMBER_DAYS = 30;
  const TOKEN_VALUE = 'unlocked';

  // -------- SHA-256 helper (exposed globally for password rotation) --------
  async function hashPassword(plain) {
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(plain));
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  window.hashPassword = hashPassword;

  // -------- Storage helpers --------
  function getStoredToken() {
    // Session storage takes priority (active session)
    const sessionToken = sessionStorage.getItem(STORAGE_KEY);
    if (sessionToken === TOKEN_VALUE) return true;

    // Then long-term storage with expiry
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.value === TOKEN_VALUE && parsed.expires > Date.now()) {
        return true;
      }
      // Expired: clean up
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    }
    return false;
  }

  function storeToken(remember) {
    if (remember) {
      const expires = Date.now() + (REMEMBER_DAYS * 24 * 60 * 60 * 1000);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        value: TOKEN_VALUE,
        expires: expires
      }));
    } else {
      sessionStorage.setItem(STORAGE_KEY, TOKEN_VALUE);
    }
  }

  function clearToken() {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  }
  window.awSignOut = clearToken;

  // -------- Page guard --------
  // Pages opt into protection by setting <body data-protected="true">.
  // They also declare the path back to the auth gate via
  // data-auth-path (defaults to "index.html" for pages at root level).
  document.addEventListener('DOMContentLoaded', function () {
    const isProtected = document.body.dataset.protected === 'true';
    if (isProtected && !getStoredToken()) {
      const authPath = document.body.dataset.authPath || 'index.html';
      window.location.replace(authPath);
    }
  });

  // -------- Password form handler --------
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('auth-form');
    if (!form) return;

    const input = document.getElementById('password');
    const remember = document.getElementById('remember');
    const errorBox = document.getElementById('auth-error');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const attempt = input.value.trim();
      if (!attempt) return;

      try {
        const hash = await hashPassword(attempt);
        if (hash === PASSWORD_HASH) {
          storeToken(remember && remember.checked);
          window.location.href = 'work.html';
        } else {
          errorBox.setAttribute('aria-hidden', 'false');
          errorBox.textContent = "That's not the password. Try again, or request access below.";
          input.value = '';
          input.focus();
        }
      } catch (err) {
        errorBox.setAttribute('aria-hidden', 'false');
        errorBox.textContent = 'Something went wrong. Refresh and try again.';
      }
    });

    // Clear the error as soon as the user starts typing again
    input.addEventListener('input', function () {
      errorBox.setAttribute('aria-hidden', 'true');
    });
  });
})();
