/* =========================================================
   Ant White — Portfolio
   Include system for shared header and footer.
   --------------------------------------------------------
   Each page has empty <header data-include="header"></header>
   and <footer data-include="footer"></footer> elements.
   This script fetches the partial HTML and injects it.
   --------------------------------------------------------
   Why this rather than copy-pasting:
     One source of truth for nav and footer. Edit
     partials/header.html and partials/footer.html and
     every page updates.
   --------------------------------------------------------
   Path notes:
     Root-level pages use "partials/header.html"
     Case study pages (one level deep) need "../partials/header.html"
     The page declares which via data-base="" or data-base="../"
   ========================================================= */

(function () {
  'use strict';

  function fixRelativeLinks(html, base) {
    // If base is "../", links in the partial like "work.html" need
    // to become "../work.html" to resolve correctly from a sub-page.
    if (!base || base === '') return html;

    // Match href="..." but not href="http..." or href="mailto..."
    // or href="#..." or href="/..." (absolute paths)
    return html.replace(
      /href="(?!https?:|mailto:|#|\/|\.\.?\/)([^"]+)"/g,
      'href="' + base + '$1"'
    );
  }

  async function loadPartial(el, base) {
    const name = el.dataset.include;
    const url = (base || '') + 'partials/' + name + '.html';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Could not load ' + url);
      let html = await res.text();
      html = fixRelativeLinks(html, base);
      el.outerHTML = html;
    } catch (err) {
      console.error('[include] ' + err.message);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const base = document.body.dataset.base || '';
    const targets = document.querySelectorAll('[data-include]');
    Promise.all(Array.from(targets).map(function (el) {
      return loadPartial(el, base);
    }));
  });
})();
