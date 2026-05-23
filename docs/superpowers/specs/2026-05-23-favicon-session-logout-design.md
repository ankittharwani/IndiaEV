# Design: Favicon, Session Persistence & Logout

**Date:** 2026-05-23  
**Status:** Approved

## Overview

Three features for the IndiaEV birthday guide web app:
1. A new branded icon + iOS home screen / PWA support
2. Session persistence so users aren't abruptly logged out on refresh
3. A logout button that resets the app to the beginning (including the birthday quiz)

---

## Feature 1: Icon & PWA Setup

### Icon Design
A new `apple-touch-icon.png` (180×180) — a birthday cake with a lightning bolt candle on a purple (`#863bff`) background. Flat, simple design readable at both 180×180 (iOS) and 32×32 (browser tab). Designed as SVG, exported to PNG.

The existing `favicon.svg` (purple lightning bolt) remains untouched for the browser tab.

### Files Changed
- `public/apple-touch-icon.png` — new 180×180 PNG icon
- `public/manifest.json` — new PWA manifest
- `index.html` — add three `<head>` tags

### `manifest.json`
```json
{
  "name": "Dad's EV Guide",
  "short_name": "EV Guide",
  "start_url": "/?quiz=0",
  "display": "standalone",
  "background_color": "#0f0f13",
  "theme_color": "#863bff",
  "icons": [
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ]
}
```

Note: `start_url` uses `?quiz=0` so PWA launches skip the birthday quiz (session persistence handles this, but it's a safe fallback for standalone mode).

### `index.html` additions
```html
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.json" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

---

## Feature 2: Session Persistence

### Storage Keys (`localStorage`)
| Key | Value | Written when |
|-----|-------|-------------|
| `ev_authenticated` | `"true"` | Password check passes in `Login.jsx` |
| `ev_quiz_complete` | `"true"` | `BirthdayFlow.onComplete` fires in `App.jsx` |

### Initial Phase Logic (`App.jsx`)
On mount, read both keys to determine starting phase:

| `ev_authenticated` | `ev_quiz_complete` | Initial phase |
|---|---|---|
| set | set | `"main"` (skip to summary) |
| set | not set | `"birthday"` (show quiz) |
| not set | — | `"login"` |

### Files Changed
- `src/components/Login.jsx` — write `ev_authenticated` on success
- `src/App.jsx` — read both keys to set initial phase; write `ev_quiz_complete` when quiz completes

---

## Feature 3: Logout Button

### Behavior
- Clears `ev_authenticated` and `ev_quiz_complete` from `localStorage`
- Sets `phase` back to `"login"` in `App.jsx`
- No confirmation dialog (personal app, low stakes)
- Side effect: user will see the birthday quiz again on next login (intentional — treat it as a replay mechanism)

### Placement
Small, muted text button in the top-right of `<header>` inside `.hero__inner`. Styled subtly so it doesn't compete with the hero content — small font, low-opacity, underline on hover.

### Files Changed
- `src/App.jsx` — add logout handler + button in header (only rendered when `phase === "main"`)

---

## Out of Scope
- Server-side session management
- Token expiry / auto-logout after inactivity
- Multiple user accounts
