/* =========================================================
   Ant White — Portfolio
   Small utilities for the public site.
   ========================================================= */

(function () {
  'use strict';

  // If a thumbnail image fails to load, hide the broken icon
  // so the grey placeholder shows cleanly underneath.
  document.querySelectorAll('.case-card__thumb img, .shorter-card__thumb img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
    });
  });
})();
