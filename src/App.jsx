import { useState } from "react";
import Login from "./components/Login";
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
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

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
