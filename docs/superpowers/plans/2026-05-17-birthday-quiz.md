# Birthday Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a birthday quiz gate that surprises Dad on his 70th birthday — he plays through 8 personal clue questions before the gift (electric car) is revealed and he's dropped into the main site.

**Architecture:** `App.jsx` replaces the `authed` boolean with a `phase` state (`'login' | 'birthday' | 'main'`). After login, phase transitions to `'birthday'` which renders `BirthdayFlow`, a self-contained orchestrator that sequences five screens (greeting → Q1–Q7 cards → Q8 reveal card → wrong-answer retry → final reveal). Correct answer on Q8 transitions `phase` to `'main'` with the Summary tab pre-selected.

**Tech Stack:** React 19, Vite 8, plain CSS (no animation libraries), all data in `src/data/quiz.js`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/data/quiz.js` | All 8 questions, options, correct answers |
| Create | `src/components/birthday/BirthdayFlow.jsx` | Orchestrates step state and screen sequencing |
| Create | `src/components/birthday/GreetingScreen.jsx` | Birthday greeting with Start button |
| Create | `src/components/birthday/QuizCard.jsx` | Single question card with 4 options + feedback |
| Create | `src/components/birthday/WrongAnswerScreen.jsx` | Retry screen for wrong Q8 guess |
| Create | `src/components/birthday/RevealScreen.jsx` | Animated badge reveal + transition CTA |
| Modify | `src/App.jsx` | Replace `authed` bool with `phase` state; render `BirthdayFlow` |
| Modify | `src/index.css` | Add birthday-specific CSS classes |

---

## Task 1: Quiz data

**Files:**
- Create: `src/data/quiz.js`

- [ ] **Step 1: Create the quiz data file**

```js
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "Cricket",
    emoji: "🏏",
    question:
      "In cricket, what lets you cover the most ground silently without tiring?",
    options: ["Electric motor", "Petrol engine", "Diesel engine", "Bicycle"],
    answer: "Electric motor",
    isReveal: false,
  },
  {
    id: 2,
    category: "Engineering",
    emoji: "💧",
    question:
      "The Narmada Dam harnesses a natural force invisibly. What does an EV harness the same way?",
    options: ["Electricity", "Gravity", "Water pressure", "Solar panels"],
    answer: "Electricity",
    isReveal: false,
  },
  {
    id: 3,
    category: "Cycling",
    emoji: "🚲",
    question:
      "Your cycling hobby has zero noise and zero emissions. Which vehicle matches that exactly?",
    options: ["Electric car", "CNG car", "Hybrid car", "Diesel car"],
    answer: "Electric car",
    isReveal: false,
  },
  {
    id: 4,
    category: "Bollywood",
    emoji: "🎬",
    question:
      "In old Bollywood, heroes always arrived in style. What's the modern hero's chariot?",
    options: ["Electric car", "SUV", "Vintage car", "Motorcycle"],
    answer: "Electric car",
    isReveal: false,
  },
  {
    id: 5,
    category: "Badminton",
    emoji: "🏸",
    question:
      "A shuttlecock needs instant response from a standing position. What car technology delivers that?",
    options: [
      "Electric motor torque",
      "Turbo diesel",
      "V6 engine",
      "Supercharger",
    ],
    answer: "Electric motor torque",
    isReveal: false,
  },
  {
    id: 6,
    category: "Honda Amaze",
    emoji: "🚗",
    question:
      "Your Honda Amaze has served you well for years. What's the next evolution beyond petrol?",
    options: [
      "Electric vehicle",
      "CNG vehicle",
      "Hybrid vehicle",
      "Premium petrol",
    ],
    answer: "Electric vehicle",
    isReveal: false,
  },
  {
    id: 7,
    category: "Technology",
    emoji: "⚡",
    question:
      "India's first lithium-ion cell gigafactory is being built. What vehicle type relies entirely on lithium batteries?",
    options: ["Electric car", "Hybrid car", "CNG car", "Hydrogen car"],
    answer: "Electric car",
    isReveal: false,
  },
  {
    id: 8,
    category: "The Gift",
    emoji: "🎁",
    question: "Based on all your clues — what is your gift?",
    options: ["Electric Car", "Smartwatch", "Foreign Holiday", "Gold Coins"],
    answer: "Electric Car",
    isReveal: true,
  },
];

export const CLUE_BADGES = [
  { emoji: "🏏", label: "Cricket" },
  { emoji: "💧", label: "Engineering" },
  { emoji: "🚲", label: "Cycling" },
  { emoji: "🎬", label: "Bollywood" },
  { emoji: "🏸", label: "Badminton" },
  { emoji: "🚗", label: "Honda Amaze" },
  { emoji: "⚡", label: "Technology" },
  { emoji: "🎁", label: "The Gift" },
];
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/quiz.js
git commit -m "feat: add quiz question data"
```

---

## Task 2: Update App.jsx phase state

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace `authed` with `phase` and wire birthday phase**

Replace the entire `App.jsx` with:

```jsx
import { useState } from "react";
import Login from "./components/Login";
import BirthdayFlow from "./components/birthday/BirthdayFlow";
import SummaryTab from "./components/SummaryTab";
import ModelsTab from "./components/ModelsTab";
import BaasTab from "./components/BaasTab";
import VariantsTab from "./components/VariantsTab";
import FinanceTab from "./components/FinanceTab";
import LinksTab from "./components/LinksTab";

const TABS = [
  { id: "summary", label: "Summary", component: SummaryTab },
  { id: "models", label: "Models", component: ModelsTab },
  { id: "baas", label: "BaaS", component: BaasTab },
  { id: "variants", label: "Variants", component: VariantsTab },
  { id: "finance", label: "Finance", component: FinanceTab },
  { id: "links", label: "Links", component: LinksTab },
];

export default function App() {
  const [phase, setPhase] = useState("login");
  const [activeTab, setActiveTab] = useState("summary");

  if (phase === "login")
    return <Login onSuccess={() => setPhase("birthday")} />;

  if (phase === "birthday")
    return (
      <BirthdayFlow
        onComplete={() => {
          setActiveTab("summary");
          setPhase("main");
        }}
      />
    );

  const ActiveComponent =
    TABS.find((t) => t.id === activeTab)?.component ?? SummaryTab;

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__inner">
          <div className="hero__eyebrow">Family Car Research · May 2026</div>
          <h1 className="hero__title">
            Finding Dad
            <br />
            his <em>perfect car</em>
          </h1>
          <p className="hero__sub">
            A complete analysis — models, BaaS financing, variants, and loan vs
            cash — so we can decide together.
          </p>
          <div className="hero__chips">
            <span className="chip chip--pick">✓ MG Windsor Exclusive</span>
            <span className="chip">VidyutTech BaaS</span>
            <span className="chip">₹15.53L</span>
            <span className="chip">38 kWh · 332 km</span>
          </div>
        </div>
      </header>
      <nav className="nav-wrap" role="navigation" aria-label="Guide sections">
        <div className="nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-btn ${activeTab === t.id ? "nav-btn--active" : ""}`}
              onClick={() => {
                setActiveTab(t.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-current={activeTab === t.id ? "page" : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>
      <main className="main-content">
        <ActiveComponent />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: Build succeeds (BirthdayFlow import will fail until Task 3 — that's fine if you're going in order; skip this step and come back after Task 3 if needed).

---

## Task 3: GreetingScreen component

**Files:**
- Create: `src/components/birthday/GreetingScreen.jsx`

- [ ] **Step 1: Create the component**

```jsx
export default function GreetingScreen({ onStart }) {
  return (
    <div className="bday-screen bday-greeting">
      <div className="bday-greeting__content">
        <div className="bday-greeting__cake">🎂</div>
        <h1 className="bday-greeting__title">Happy 70th Birthday</h1>
        <p className="bday-greeting__name">Dad</p>
        <p className="bday-greeting__date">18th May 2026</p>
        <p className="bday-greeting__sub">
          We&apos;ve been planning something special for you.
          <br />
          Can you guess what your gift is?
        </p>
        <button className="bday-btn bday-btn--primary" onClick={onStart}>
          Start the quiz →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/birthday/GreetingScreen.jsx
git commit -m "feat: add birthday greeting screen"
```

---

## Task 4: QuizCard component

**Files:**
- Create: `src/components/birthday/QuizCard.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useState, useEffect } from "react";

export default function QuizCard({ question, index, total, onNext }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const isReveal = question.isReveal;
  const correct = question.answer;

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [question.id]);

  function handleSelect(option) {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);

    const isCorrect = option === correct;

    if (!isReveal) {
      setTimeout(() => onNext({ correct: isCorrect }), isCorrect ? 1200 : 1800);
    } else {
      setTimeout(() => onNext({ correct: isCorrect }), isCorrect ? 1200 : 1800);
    }
  }

  function optionClass(option) {
    if (!revealed) return "bday-option";
    if (option === correct) return "bday-option bday-option--correct";
    if (option === selected) return "bday-option bday-option--wrong";
    return "bday-option bday-option--dim";
  }

  return (
    <div className="bday-screen bday-quiz">
      <div className="bday-quiz__card">
        <div className="bday-quiz__badge">
          <span className="bday-quiz__emoji">{question.emoji}</span>
          <span className="bday-quiz__category">{question.category}</span>
        </div>

        <p className="bday-quiz__question">{question.question}</p>

        <div className="bday-quiz__options">
          {question.options.map((opt) => (
            <button
              key={opt}
              className={optionClass(opt)}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
            >
              {opt}
            </button>
          ))}
        </div>

        {revealed && (
          <p className={`bday-quiz__feedback ${selected === correct ? "bday-quiz__feedback--correct" : "bday-quiz__feedback--wrong"}`}>
            {selected === correct ? "Correct! ✓" : `The answer is: ${correct}`}
          </p>
        )}

        <p className="bday-quiz__progress">
          Question {index + 1} of {total}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/birthday/QuizCard.jsx
git commit -m "feat: add quiz card with per-question feedback"
```

---

## Task 5: WrongAnswerScreen component

**Files:**
- Create: `src/components/birthday/WrongAnswerScreen.jsx`

- [ ] **Step 1: Create the component**

```jsx
export default function WrongAnswerScreen({ wrongAnswer, onRetry }) {
  return (
    <div className="bday-screen bday-wrong">
      <div className="bday-wrong__content">
        <p className="bday-wrong__emoji">🤔</p>
        <h2 className="bday-wrong__title">Not quite, Dad!</h2>
        <p className="bday-wrong__answer">{wrongAnswer}</p>
        <p className="bday-wrong__hint">
          The clues are all there — take another look!
        </p>
        <button className="bday-btn bday-btn--secondary" onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/birthday/WrongAnswerScreen.jsx
git commit -m "feat: add wrong answer retry screen"
```

---

## Task 6: RevealScreen component

**Files:**
- Create: `src/components/birthday/RevealScreen.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { CLUE_BADGES } from "../../data/quiz";

export default function RevealScreen({ onExplore }) {
  return (
    <div className="bday-screen bday-reveal">
      <div className="bday-reveal__content">
        <p className="bday-reveal__party">🎉</p>
        <h2 className="bday-reveal__title">You guessed it, Dad!</h2>
        <p className="bday-reveal__gift">Your gift is an Electric Car</p>

        <div className="bday-reveal__badges">
          {CLUE_BADGES.map((badge, i) => (
            <div
              key={badge.label}
              className="bday-reveal__badge"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <span className="bday-reveal__badge-emoji">{badge.emoji}</span>
              <span className="bday-reveal__badge-label">{badge.label}</span>
            </div>
          ))}
        </div>

        <p className="bday-reveal__tagline">
          70 years of wisdom — and you cracked it in 8 clues.
        </p>

        <button className="bday-btn bday-btn--primary" onClick={onExplore}>
          Explore your car →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/birthday/RevealScreen.jsx
git commit -m "feat: add animated reveal screen"
```

---

## Task 7: BirthdayFlow orchestrator

**Files:**
- Create: `src/components/birthday/BirthdayFlow.jsx`

- [ ] **Step 1: Create the orchestrator**

```jsx
import { useState } from "react";
import { QUIZ_QUESTIONS } from "../../data/quiz";
import GreetingScreen from "./GreetingScreen";
import QuizCard from "./QuizCard";
import WrongAnswerScreen from "./WrongAnswerScreen";
import RevealScreen from "./RevealScreen";

export default function BirthdayFlow({ onComplete }) {
  const [step, setStep] = useState("greeting");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(null);

  if (step === "greeting") {
    return <GreetingScreen onStart={() => setStep("quiz")} />;
  }

  if (step === "wrong") {
    return (
      <WrongAnswerScreen
        wrongAnswer={wrongAnswer}
        onRetry={() => {
          setWrongAnswer(null);
          setStep("quiz");
        }}
      />
    );
  }

  if (step === "reveal") {
    return <RevealScreen onExplore={onComplete} />;
  }

  const question = QUIZ_QUESTIONS[questionIndex];

  function handleNext({ correct }) {
    if (question.isReveal) {
      if (correct) {
        setStep("reveal");
      } else {
        setWrongAnswer(
          QUIZ_QUESTIONS[questionIndex].options.find(
            (o) => o !== QUIZ_QUESTIONS[questionIndex].answer,
          ) ?? "your answer",
        );
        setStep("wrong");
      }
      return;
    }
    setQuestionIndex((i) => i + 1);
  }

  return (
    <QuizCard
      question={question}
      index={questionIndex}
      total={QUIZ_QUESTIONS.length}
      onNext={handleNext}
    />
  );
}
```

**Note:** The `wrongAnswer` passed to `WrongAnswerScreen` is the answer Dad actually selected. The current `handleNext` receives `correct` (bool) but not the selected value. Fix this in the next step.

- [ ] **Step 2: Update handleNext to receive selected answer**

`QuizCard.jsx` calls `onNext({ correct: isCorrect })`. Update the call to also pass the selected option:

In `src/components/birthday/QuizCard.jsx`, change both `setTimeout` calls from:
```js
setTimeout(() => onNext({ correct: isCorrect }), isCorrect ? 1200 : 1800);
```
to:
```js
setTimeout(() => onNext({ correct: isCorrect, selected: option }), isCorrect ? 1200 : 1800);
```

Then in `BirthdayFlow.jsx`, update `handleNext` signature and wrong-answer logic:

```jsx
function handleNext({ correct, selected }) {
  if (question.isReveal) {
    if (correct) {
      setStep("reveal");
    } else {
      setWrongAnswer(selected);
      setStep("wrong");
    }
    return;
  }
  setQuestionIndex((i) => i + 1);
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```
Expected: Build succeeds, no import errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/birthday/BirthdayFlow.jsx src/components/birthday/QuizCard.jsx
git commit -m "feat: add BirthdayFlow orchestrator"
```

---

## Task 8: CSS for birthday flow

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Append birthday CSS to the end of `src/index.css`**

```css
/* ── Birthday quiz flow ──────────────────────────────────── */
.bday-screen {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
  box-sizing: border-box;
}

/* Greeting */
.bday-greeting {
  background: #0f0f0f;
}
.bday-greeting__content {
  text-align: center;
  max-width: 480px;
}
.bday-greeting__cake {
  font-size: 4rem;
  margin-bottom: 1rem;
}
.bday-greeting__title {
  font-size: 2rem;
  font-weight: 700;
  color: #d4a017;
  margin: 0 0 0.25rem;
}
.bday-greeting__name {
  font-size: 1.5rem;
  color: #fff;
  margin: 0 0 0.15rem;
}
.bday-greeting__date {
  font-size: 0.9rem;
  color: #888;
  margin: 0 0 1.5rem;
}
.bday-greeting__sub {
  font-size: 1.05rem;
  color: #ccc;
  line-height: 1.7;
  margin-bottom: 2rem;
}

/* Quiz card */
.bday-quiz {
  background: var(--bg, #f5f5f5);
}
.bday-quiz__card {
  background: var(--card-bg, #fff);
  border-radius: 1rem;
  padding: 2rem 1.75rem;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}
.bday-quiz__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #f0f0f0;
  border-radius: 99px;
  padding: 0.25rem 0.75rem;
  margin-bottom: 1.25rem;
}
.bday-quiz__emoji {
  font-size: 1.1rem;
}
.bday-quiz__category {
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.bday-quiz__question {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text, #1a1a1a);
  line-height: 1.5;
  margin: 0 0 1.5rem;
}
.bday-quiz__options {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 1rem;
}
.bday-option {
  padding: 0.75rem 1rem;
  border: 1.5px solid #ddd;
  border-radius: 0.6rem;
  background: #fff;
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.bday-option:hover:not(:disabled) {
  border-color: #aaa;
  background: #fafafa;
}
.bday-option--correct {
  border-color: #2a7a4b;
  background: #edf7f1;
  color: #1a5c34;
  font-weight: 600;
}
.bday-option--wrong {
  border-color: #c0392b;
  background: #fdf0ef;
  color: #8b1a14;
  text-decoration: line-through;
}
.bday-option--dim {
  opacity: 0.4;
}
.bday-quiz__feedback {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0.5rem 0 0;
}
.bday-quiz__feedback--correct {
  color: #2a7a4b;
}
.bday-quiz__feedback--wrong {
  color: #c0392b;
}
.bday-quiz__progress {
  margin: 1.25rem 0 0;
  text-align: right;
  font-size: 0.8rem;
  color: #999;
}

/* Wrong answer */
.bday-wrong {
  background: #0f0f0f;
}
.bday-wrong__content {
  text-align: center;
  max-width: 420px;
}
.bday-wrong__emoji {
  font-size: 3rem;
  margin: 0 0 0.75rem;
}
.bday-wrong__title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem;
}
.bday-wrong__answer {
  font-size: 1rem;
  color: #c0392b;
  text-decoration: line-through;
  margin: 0 0 0.75rem;
}
.bday-wrong__hint {
  font-size: 1rem;
  color: #ccc;
  margin: 0 0 2rem;
}

/* Reveal */
.bday-reveal {
  background: #0f0f0f;
}
.bday-reveal__content {
  text-align: center;
  max-width: 560px;
}
.bday-reveal__party {
  font-size: 3.5rem;
  margin: 0 0 0.75rem;
}
.bday-reveal__title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.4rem;
}
.bday-reveal__gift {
  font-size: 1.25rem;
  font-weight: 600;
  color: #d4a017;
  margin: 0 0 2rem;
}
.bday-reveal__badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}
.bday-reveal__badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  opacity: 0;
  transform: scale(0.6);
  animation: badge-pop 0.4s ease forwards;
}
@keyframes badge-pop {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.bday-reveal__badge-emoji {
  font-size: 1.75rem;
}
.bday-reveal__badge-label {
  font-size: 0.65rem;
  color: #888;
  text-align: center;
}
.bday-reveal__tagline {
  font-size: 0.95rem;
  color: #aaa;
  font-style: italic;
  margin: 0 0 2rem;
}

/* Shared buttons */
.bday-btn {
  padding: 0.85rem 2rem;
  border: none;
  border-radius: 0.6rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.bday-btn:hover {
  opacity: 0.88;
}
.bday-btn--primary {
  background: #d4a017;
  color: #000;
}
.bday-btn--secondary {
  background: #333;
  color: #fff;
}
```

- [ ] **Step 2: Run lint and format check**

```bash
npm run lint && npm run format:check
```
Expected: No errors. If format fails, run `npm run format` then re-check.

- [ ] **Step 3: Verify full build**

```bash
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat: add birthday quiz CSS"
```

---

## Task 9: Wire App.jsx and final verification

**Files:**
- Modify: `src/App.jsx` (already done in Task 2 — this task is end-to-end verification)

- [ ] **Step 1: Run all CI checks**

```bash
npm run lint && npm run format:check && npm run build
```
Expected: All three pass with no errors.

- [ ] **Step 2: Smoke-test the flow manually**

Start the dev server:
```bash
npm run dev
```
Check each screen in order:
1. Enter password → lands on greeting screen (dark background, gold text, 🎂)
2. Click "Start the quiz →" → Q1 appears (cricket badge, 4 options)
3. Select wrong answer → red highlight, correct shown green, auto-advance
4. Select correct answer → green highlight, auto-advance
5. Advance through Q2–Q7
6. Q8 appears ("Based on all your clues — what is your gift?")
7. Select "Smartwatch" → wrong-answer screen appears with "Smartwatch" struck through
8. Click "Try again" → Q8 returns with reshuffled options
9. Select "Electric Car" → reveal screen (gold, animated badges Q1→Q8)
10. Click "Explore your car →" → main site, Summary tab active

- [ ] **Step 3: Final commit**

```bash
git add src/App.jsx
git commit -m "feat: wire birthday quiz phase into App"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Phase state: `'login' \| 'birthday' \| 'main'` | Task 2 |
| Greeting screen: dark bg, gold, 🎂, date, Start button | Task 3 + Task 8 |
| Q1–Q7: card with category badge, 4 options, auto-advance | Task 4 + Task 8 |
| Show correct answer after wrong Q1–Q7 selection | Task 4 |
| Q8 reveal question with 4 options incl. Electric Car | Task 1 |
| Wrong-answer screen: struck answer, retry Q8 | Task 5 + Task 7 |
| Reveal screen: animated badge cascade Q1→Q8, gold | Task 6 + Task 8 |
| Badge animation: 150ms stagger CSS | Task 8 |
| Transition to main site on Summary tab | Task 2 + Task 7 |
| All 8 questions with correct options and answers | Task 1 |
