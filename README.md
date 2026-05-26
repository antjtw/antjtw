# Ant White — Portfolio

Static portfolio site, password-gated. No build step.

## Structure

```
portfolio/
├── index.html              Password gate (the public entry point)
├── work.html               Home (hero + 6 case study grid)
├── cv.html                 CV
├── contact.html            Contact
├── css/
│   └── styles.css          Token-driven CSS, light + dark, 3 breakpoints
├── js/
│   ├── auth.js             Password gate + page guard
│   └── main.js             Image fallback handling
├── images/                 Drop thumbnails and case study images here
└── case-studies/
    ├── ee-add-mobile.html
    ├── ee-data-plans.html
    ├── westfield-health.html
    ├── govuk-covid.html
    ├── sky-broadband.html
    └── mtfbwy-rpg.html
```

## Password gate

**Current password:** `please-hire-me`

The password is stored as a SHA-256 hash in `js/auth.js`, not plaintext. To change it:

1. Open the password page in a browser, then open the dev console.
2. Run `await hashPassword('your-new-password')` and copy the result.
3. Paste the new hash into `PASSWORD_HASH` in `js/auth.js`.

### How persistence works

- **Default:** Session storage. Visitor stays unlocked until they close the browser tab.
- **"Remember me" checked:** Local storage with a 30-day expiry. Visitor stays unlocked across browser closes for 30 days; after that, re-prompted.

### When the visitor gets re-prompted

- They close the browser without ticking "Remember me" → re-prompt next visit.
- 30 days have passed since they ticked "Remember me" → re-prompt.
- They deep-link to any protected page without a valid token → redirect to `/index.html`.
- They visit on a different device or in a private window → re-prompt.

### Signing out (you, while testing)

Run `awSignOut()` in the dev console on any page. Refreshes back to the gate.

### What this protects against

- Casual recruiters and crawlers
- Linking directly to a case study from a public Slack / Twitter
- People sharing your portfolio URL without sharing the password

### What this does NOT protect against

- Someone reading the page source and finding the hash
- A determined snooper who knows the password is in the JS

It's a soft gate. The password is a social signal ("you asked, I gave it to you") not a vault.

## Design tokens

All styling driven by CSS variables that mirror the Figma token structure:

- **Three breakpoints:** small (<600px), medium (600–959px), full (≥960px)
- **Two colour schemes:** light (default) and dark (via `prefers-color-scheme`)
- **Single font family:** Inter (loaded from Google Fonts)

The token values come from your JSON exports. If you update the tokens in Figma, update the CSS variables in `:root` and the `@media` blocks at the top of `styles.css`.

## Adding images

Each case card on `work.html` expects a thumbnail at:

- `images/ee-add-mobile-thumb.png`
- `images/ee-data-plans-thumb.png`
- `images/westfield-health-thumb.png`
- `images/govuk-covid-thumb.png`
- `images/sky-broadband-thumb.png`
- `images/mtfbwy-rpg-thumb.png`

If the file is missing, the card shows the soft grey surface placeholder. Aspect ratio is 4:3.

Each case study page expects a hero image at `images/{slug}-hero.png` (16:9). Update the inline comment in the case study HTML to swap the placeholder div for a real `<img>`.

## Hosting note

This works as static files on any host. If you're on Netlify or similar, no special config needed. The `noindex` meta tag is on every page to keep this off search engines while it's gated.
