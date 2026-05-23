# Favicon, Session Persistence & Logout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a branded iOS-compatible app icon, persistent login/quiz state via localStorage, and a logout button that resets the full experience including the birthday quiz.

**Architecture:** Three independent tracks — (1) static assets + HTML meta tags for PWA/iOS icon support, (2) localStorage read/write wired into the existing login and quiz completion flow, (3) a logout button absolutely positioned in the hero header. All changes are confined to `index.html`, `public/`, `src/components/Login.jsx`, `src/App.jsx`, and `src/index.css`.

**Tech Stack:** React (Vite), localStorage API, SVG for icon source, `@resvg/resvg-js` for one-time SVG-to-PNG conversion.

---

### Task 1: Create the app icon (SVG → PNG)

**Files:**
- Create: `public/apple-touch-icon.svg`
- Create: `scripts/generate-icon.js`
- Create: `public/apple-touch-icon.png` (generated artifact)

- [ ] **Step 1: Create the icon SVG**

Create `public/apple-touch-icon.svg` with this exact content:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <!-- Purple rounded-square background -->
  <rect width="180" height="180" rx="36" fill="#863bff"/>
  <!-- Bottom cake tier -->
  <rect x="26" y="104" width="128" height="46" rx="9" fill="#fffaf3"/>
  <rect x="26" y="104" width="128" height="11" rx="5" fill="white"/>
  <!-- Top cake tier -->
  <rect x="48" y="68" width="84" height="38" rx="9" fill="#fffaf3"/>
  <rect x="48" y="68" width="84" height="10" rx="5" fill="white"/>
  <!-- Candle -->
  <rect x="84" y="52" width="12" height="18" rx="4" fill="#ff9f43"/>
  <!-- Lightning bolt (replacing candle flame) -->
  <path d="M94 26 L86 48 L91 48 L83 62 L98 44 L93 44 Z" fill="#ffeaa7"/>
  <!-- Decorative dots on bottom tier -->
  <circle cx="62" cy="124" r="4" fill="#a36bff" opacity="0.3"/>
  <circle cx="90" cy="124" r="4" fill="#a36bff" opacity="0.3"/>
  <circle cx="118" cy="124" r="4" fill="#a36bff" opacity="0.3"/>
</svg>
```

- [ ] **Step 2: Preview the SVG**

Open `public/apple-touch-icon.svg` in a browser tab (drag-and-drop the file). Confirm: purple background, white two-tier cake with frosting strips, orange candle, yellow lightning bolt above the candle.

- [ ] **Step 3: Install the SVG-to-PNG converter**

```bash
npm install --save-dev @resvg/resvg-js
```

Expected: package installs without errors, `@resvg/resvg-js` appears in `package.json` devDependencies.

- [ ] **Step 4: Create the conversion script**

```bash
mkdir -p scripts
```

Create `scripts/generate-icon.js`:

```js
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const svg = fs.readFileSync(path.join(__dirname, '../public/apple-touch-icon.svg'), 'utf8');
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 180 } });
const pngData = resvg.render();
fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), pngData.asPng());
console.log('apple-touch-icon.png written (180×180)');
```

- [ ] **Step 5: Generate the PNG**

```bash
node scripts/generate-icon.js
```

Expected output:
```
apple-touch-icon.png written (180×180)
```

Verify the file exists and is non-trivial in size:
```bash
ls -lh public/apple-touch-icon.png
```

Expected: file exists, size between 3KB and 20KB.

- [ ] **Step 6: Commit**

```bash
git add public/apple-touch-icon.svg public/apple-touch-icon.png scripts/generate-icon.js package.json package-lock.json
git commit -m "feat: add birthday cake + lightning bolt app icon"
```

---

### Task 2: PWA manifest + iOS meta tags

**Files:**
- Create: `public/manifest.json`
- Modify: `index.html`

- [ ] **Step 1: Create the PWA manifest**

Create `public/manifest.json`:

```json
{
  "name": "Dad's EV Guide",
  "short_name": "EV Guide",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f13",
  "theme_color": "#863bff",
  "icons": [
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 2: Add meta tags to `index.html`**

Current `index.html` head (lines 4–6):
```html
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Happy Birthday, Dad 🎂</title>
```

Replace with:
```html
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="EV Guide" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Happy Birthday, Dad 🎂</title>
```

- [ ] **Step 3: Verify in browser DevTools**

Run `npm run dev`. Open browser DevTools → Application tab → Manifest section. Confirm:
- Name shows "Dad's EV Guide"
- Icon thumbnail appears
- Display mode shows "standalone"

- [ ] **Step 4: Commit**

```bash
git add public/manifest.json index.html
git commit -m "feat: add PWA manifest and iOS home screen meta tags"
```

---

### Task 3: Session persistence — write on login

**Files:**
- Modify: `src/components/Login.jsx` (lines 10–20)

- [ ] **Step 1: Write `ev_authenticated` to localStorage on successful login**

In `src/components/Login.jsx`, find `handleSubmit` (lines 10–20):

```jsx
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pw.trim() === PASSWORD) {
        onSuccess();
      } else {
        setErr("Incorrect password. Try again.");
        setPw("");
        setLoading(false);
      }
    }, 300);
  };
```

Replace with:
```jsx
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pw.trim() === PASSWORD) {
        localStorage.setItem("ev_authenticated", "true");
        onSuccess();
      } else {
        setErr("Incorrect password. Try again.");
        setPw("");
        setLoading(false);
      }
    }, 300);
  };
```

- [ ] **Step 2: Manual verification**

Run `npm run dev`. Enter the correct password. After the login transitions, open DevTools → Application → Local Storage → `http://localhost:5173`. Confirm: key `ev_authenticated` with value `"true"` is present.

- [ ] **Step 3: Commit**

```bash
git add src/components/Login.jsx
git commit -m "feat: persist authentication state to localStorage on login"
```

---

### Task 4: Session read on load + quiz tracking + logout button

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/index.css`

- [ ] **Step 1: Add `getInitialPhase` helper above the component**

In `src/App.jsx`, find the `skipQuiz` line and the `export default function App()` declaration (lines 20–25):

```jsx
const skipQuiz =
  new URLSearchParams(window.location.search).get("quiz") === "0";

export default function App() {
  const [phase, setPhase] = useState("login");
  const [activeTab, setActiveTab] = useState("summary");
```

Replace with:
```jsx
const skipQuiz =
  new URLSearchParams(window.location.search).get("quiz") === "0";

function getInitialPhase() {
  const authed = localStorage.getItem("ev_authenticated") === "true";
  const quizDone = localStorage.getItem("ev_quiz_complete") === "true";
  if (authed && quizDone) return "main";
  if (authed) return "birthday";
  return "login";
}

export default function App() {
  const [phase, setPhase] = useState(getInitialPhase);
  const [activeTab, setActiveTab] = useState("summary");

  const handleLogout = () => {
    localStorage.removeItem("ev_authenticated");
    localStorage.removeItem("ev_quiz_complete");
    setPhase("login");
  };
```

Note: `useState(getInitialPhase)` (no parentheses) passes the function as a lazy initializer — React calls it once on mount, not on every render.

- [ ] **Step 2: Write `ev_quiz_complete` when the birthday quiz finishes**

Find the `BirthdayFlow` block (lines ~32–38):

```jsx
  if (phase === "birthday")
    return (
      <BirthdayFlow
        onComplete={() => {
          setActiveTab("summary");
          setPhase("main");
        }}
      />
    );
```

Replace with:
```jsx
  if (phase === "birthday")
    return (
      <BirthdayFlow
        onComplete={() => {
          localStorage.setItem("ev_quiz_complete", "true");
          setActiveTab("summary");
          setPhase("main");
        }}
      />
    );
```

- [ ] **Step 3: Add the logout button to the header**

Find the `<header className="hero">` opening in the main return (line ~44):

```jsx
      <header className="hero">
        <div className="hero__inner">
```

Replace with:
```jsx
      <header className="hero">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <div className="hero__inner">
```

The button is placed as a sibling of `.hero__inner` so it can be absolutely positioned relative to `.hero`, which already has `position: relative`.

- [ ] **Step 4: Add logout button styles to `src/index.css`**

Append to the end of `src/index.css`:

```css
.logout-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.7rem;
  font-family: var(--font-sans);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.logout-btn:hover {
  color: rgba(255, 255, 255, 0.7);
}
```

- [ ] **Step 5: End-to-end manual verification**

Run `npm run dev`. Test all three flows in order:

**Flow 1 — Fresh visit (no session):**
1. Open DevTools → Application → Local Storage → Clear all for `localhost:5173`
2. Reload — should see the login screen
3. Enter correct password → should see the birthday quiz
4. Complete the quiz → should land on the Summary tab
5. Check DevTools — both `ev_authenticated` and `ev_quiz_complete` should be `"true"`

**Flow 2 — Returning visit (session active):**
1. Reload the page without clearing storage
2. Should go straight to Summary tab (no login, no quiz)

**Flow 3 — Logout:**
1. Click the "Logout" button (top-right of the header)
2. Should return to the login screen
3. Check DevTools — both localStorage keys should be gone
4. Enter the correct password again → should see the birthday quiz (keys cleared, so quiz replays)

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: add session persistence on load, quiz tracking, and logout"
```

---

## Summary

| Task | Files touched | Commit |
|------|--------------|--------|
| 1 — Icon | `public/apple-touch-icon.svg`, `public/apple-touch-icon.png`, `scripts/generate-icon.js` | `feat: add birthday cake + lightning bolt app icon` |
| 2 — PWA | `public/manifest.json`, `index.html` | `feat: add PWA manifest and iOS home screen meta tags` |
| 3 — Login write | `src/components/Login.jsx` | `feat: persist authentication state to localStorage on login` |
| 4 — App read/logout | `src/App.jsx`, `src/index.css` | `feat: add session persistence on load, quiz tracking, and logout` |
