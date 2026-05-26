# Ant White — Portfolio

Static portfolio site, password-gated, with shared header and footer partials. No build step.

## Structure

```
portfolio/
├── index.html              Password gate (the public entry point)
├── work.html               Home (hero + 6 case study grid)
├── cv.html                 CV
├── partials/
│   ├── header.html         Shared nav (injected via includes.js)
│   └── footer.html         Shared footer (injected via includes.js)
├── css/
│   └── styles.css          Token-driven, light + dark, 3 breakpoints
├── js/
│   ├── auth.js             Password gate + page guard
│   ├── includes.js         Header/footer include system
│   └── main.js             Image fallback handling
├── images/                 Drop thumbnails and case study images here
├── case-studies/
│   ├── ee-add-mobile.html
│   ├── ee-data-plans.html
│   ├── westfield-health.html
│   ├── govuk-covid.html
│   ├── sky-broadband.html
│   └── mtfbwy-rpg.html
├── vercel.json             Vercel deployment config (static site)
└── README.md
```

## Editing the nav or footer

Open `partials/header.html` or `partials/footer.html`. Edit. Save. Every page picks up the change automatically.

### How the include system works

Each page contains empty placeholder elements:

```html
<header data-include="header"></header>
<footer data-include="footer"></footer>
```

On page load, `js/includes.js` fetches `partials/header.html` and `partials/footer.html` and replaces the placeholders. For pages in sub-folders (like `case-studies/ee-add-mobile.html`), the page declares `<body data-base="../">` and the include script rewrites all relative links in the partial with the `../` prefix.

### Caveats

- The partials are loaded over HTTP via `fetch()`. Opening the HTML files directly via `file://` in your browser won't work — you'll see empty header/footer regions. To preview locally, use a quick HTTP server: `python3 -m http.server` from the portfolio root.
- On Vercel/Netlify and any normal hosting, HTTP is the default, so this works without any setup.

## Password gate

**Current password:** `please-hire-me`

Stored as a SHA-256 hash in `js/auth.js`. To change:
1. Open the password page in browser, open dev console.
2. Run `await hashPassword('your-new-password')` and copy the result.
3. Paste the new hash into `PASSWORD_HASH` in `js/auth.js`.

### Persistence

- **Default:** Session storage. Visitor stays unlocked until they close the browser tab.
- **"Remember me" checked:** Local storage with a 30-day expiry.

### Signing out (while testing)

Run `awSignOut()` in the dev console on any page.

## Design tokens

CSS variables mirror the Figma token structure:

- **Three breakpoints:** small (<600px), medium (600–959px), full (≥960px)
- **Two colour schemes:** light (default) and dark (via `prefers-color-scheme`)
- **Single font family:** Inter (loaded from Google Fonts)
- **Heading-l sizes:** 28px (small) / 40px (medium) / 48px (full)

To update tokens, edit the CSS variables at the top of `styles.css` — there's a `:root` block plus two `@media` overrides.

## Adding images

Each case card on `work.html` expects a thumbnail at `images/{slug}-thumb.png` (4:3 aspect ratio).

Each case study page expects a hero image at `images/{slug}-hero.png` (16:9).

If missing, cards/heroes show a soft grey placeholder.

## Deployment

This is a static site. The `vercel.json` config tells Vercel to skip any build step and serve files as-is.

To deploy elsewhere (Netlify, Cloudflare Pages, GitHub Pages): just upload the folder. No config needed.
