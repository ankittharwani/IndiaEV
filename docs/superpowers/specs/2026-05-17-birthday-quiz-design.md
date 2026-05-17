# Birthday Quiz — Design Spec

**Date:** 2026-05-17  
**Feature:** Birthday surprise quiz gate for Dad's 70th birthday (18 May 2026)

---

## Overview

Before reaching the main EV research site, Dad sees a birthday greeting and must play a 7-clue + 1-reveal quiz to guess his gift (an electric car). Each clue question is personal to him. Getting the final answer right transitions him directly into the main site on the Summary tab.

---

## Architecture

### Phase State

`App.jsx` holds a single `phase` state:

```
'login' | 'birthday' | 'main'
```

- `'login'` → existing password gate (unchanged)
- `'birthday'` → birthday quiz flow (new)
- `'main'` → existing tabbed research site (unchanged)

After successful login, `phase` transitions to `'birthday'` instead of `'main'`. After the quiz reveal, it transitions to `'main'` with the Summary tab pre-selected.

### New Components

| Component | Purpose |
|---|---|
| `BirthdayFlow.jsx` | Orchestrates all quiz screens; owns `step` and `score` state |
| `GreetingScreen.jsx` | Initial birthday greeting with Start button |
| `QuizCard.jsx` | Single question card with 4 options and feedback |
| `RevealScreen.jsx` | Final reveal with animated clue badges |
| `WrongAnswerScreen.jsx` | Gentle retry screen for incorrect Q8 answer |

### Data

Quiz questions live in `src/data/quiz.js` — plain array of objects, no runtime logic. `BirthdayFlow.jsx` imports and sequences them.

---

## Screens

### 1. Greeting Screen

- Dark background, warm gold accent
- Content:
  ```
  🎂
  Happy 70th Birthday
  Dad
  18th May 2026

  We've been planning something special for you.
  Can you guess what your gift is?

  [ Start the quiz → ]
  ```
- No score shown. Single CTA button advances to Q1.

### 2. Question Card (Q1–Q7)

Each question uses a "card with category badge" layout:

```
┌─────────────────────────────────┐
│  🏏 Cricket                     │  ← emoji + category label (badge)
│                                 │
│  [Question text]                │
│                                 │
│  ○ Option A                     │
│  ○ Option B                     │
│  ○ Option C                     │
│  ○ Option D                     │
│                                 │
│  Question 1 of 8                │
└─────────────────────────────────┘
```

**After selecting an answer:**
- Correct: option highlights green, brief "Correct! ✓" message, auto-advances after ~1.2s
- Wrong: option highlights red, correct answer reveals in green, brief message, auto-advances after ~1.8s

Questions are not skippable. No going back.

### 3. Question Card (Q8 — Reveal Question)

Same card layout, but this is the final guess. The question asks Dad to name his gift from 4 options. Wrong answer shows the Wrong Answer Screen. Correct answer shows the Reveal Screen.

### 4. Wrong Answer Screen (Q8 only)

```
Not quite, Dad! 🤔

[His wrong answer, struck through]

The clues are all there — take another look!

[ Try again ]
```

Warm/gentle tone. Retries Q8 only (not the full quiz). Options reshuffled on retry.

### 5. Reveal Screen

```
🎉

You guessed it, Dad!

Your gift is an Electric Car

[8 glowing clue badges, animated in Q1→Q8 order]
🏏  💧  🚲  🎬  🏸  🚗  ⚡  🔋

"70 years of wisdom — and you cracked it in 8 clues."

[ Explore your car → ]
```

- Dark background, gold accent
- Badges cascade in (Q1 first, Q8 last), ~150ms stagger
- Button transitions `phase` to `'main'` and sets active tab to `'summary'`

---

## Questions

All 8 questions, in order:

| # | Category | Emoji | Question | Correct Answer | Hint (why it connects) |
|---|---|---|---|---|---|
| 1 | Cricket | 🏏 | In cricket, what lets you cover the most ground silently without tiring? | Electric motor | Drive/motor pun |
| 2 | Engineering | 💧 | The Narmada Dam harnesses a natural force invisibly. What does an EV harness the same way? | Electricity | Clean energy parallel |
| 3 | Cycling | 🚲 | Your cycling hobby has zero noise and zero emissions. Which vehicle matches that exactly? | Electric car | Silent, clean |
| 4 | Bollywood | 🎬 | In old Bollywood, heroes always arrived in style. What's the modern hero's chariot? | Electric car | Classic → modern |
| 5 | Badminton | 🏸 | A shuttlecock needs instant acceleration from a standing position. What car technology delivers that? | Electric motor torque | Instant torque |
| 6 | Honda Amaze | 🚗 | Your Honda Amaze has served you well for years. What's the next evolution beyond petrol? | Electric vehicle | Direct upgrade framing |
| 7 | Technology | ⚡ | India's first lithium-ion cell gigafactory is being built. What vehicle type relies entirely on lithium batteries? | Electric car | Tech/industry angle |
| 8 | Reveal | 🎁 | Based on all the clues — what is your gift? | Electric Car | Final guess |

**Q8 options:** Electric Car / Smartwatch / Foreign Holiday / Gold Coins

---

## State Flow

```
login ──(correct password)──► birthday
  │
  ├─ GreetingScreen
  │    └─(Start)──► step=0 (Q1)
  │
  ├─ QuizCard[step 0..6]  (Q1–Q7, auto-advance after feedback)
  │
  ├─ QuizCard[step 7]  (Q8)
  │    ├─(correct)──► RevealScreen
  │    └─(wrong)───► WrongAnswerScreen ──(Try again)──► QuizCard[step 7]
  │
  └─ RevealScreen
       └─(Explore)──► main (Summary tab)
```

---

## Styling

- Birthday flow uses its own CSS section in `index.css` (or `birthday.css` imported in `BirthdayFlow.jsx`)
- Dark background (`#0f0f0f`) for greeting and reveal screens
- Card background matches existing `--card-bg` for question cards
- Gold accent: `#d4a017`
- Category badge: small pill with emoji + label, top-left of card
- Progress indicator: "Question N of 8" bottom-right of card, no progress bar
- Reveal badges: `display: flex; gap: 1rem;` row, each badge fades+scales in sequentially via CSS animation with `animation-delay`

---

## Out of Scope

- No scoring display (pass/fail only on Q8)
- No timer per question
- No skip or back navigation
- No confetti or third-party animation library (CSS only)
- No persistence (refresh resets to greeting)
