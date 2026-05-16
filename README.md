# Dad's Car Guide 🚗

A family research app comparing EVs in India — built to decide between MG Windsor EV, Tata Nexon EV, and Tata Punch EV.

**Stack:** React + Vite · Netlify · GitHub Actions CI

---

## Getting started

```bash
git clone https://github.com/YOUR_USERNAME/dad-car-guide.git
cd dad-car-guide
npm install
cp .env.example .env.local   # set VITE_APP_PASSWORD
npm run dev                  # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build → `dist/` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run format:check` | Prettier check (used in CI) |

## Deploy to Netlify (Git-connected)

1. Push repo to GitHub
2. Netlify → **Add new site → Import existing project** → connect GitHub repo
3. Build settings auto-detected from `netlify.toml`
4. **Site config → Environment variables** → add `VITE_APP_PASSWORD`
5. Every push to `main` deploys automatically

## GitHub Actions CI

Add this secret to your repo (**Settings → Secrets → Actions**):
```
VITE_APP_PASSWORD = your_password_here
```

CI runs ESLint, Prettier check, and Vite build on every push and PR.

## Project structure

```
src/
├── components/     # One file per tab + Login + CarSVG
├── data/cars.js    # All data centralised here — edit prices here
├── hooks/          # useFormatter
├── App.jsx         # Shell + tab routing
└── index.css       # All styles
```

## Updating data

All car prices, features, BaaS rates, and links live in `src/data/cars.js`. No other files need changing when data changes.

---
*All prices ex-showroom Delhi · May 2026 · Verify with dealer before purchase*
