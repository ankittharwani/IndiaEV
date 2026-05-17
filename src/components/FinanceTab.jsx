import { useState, useMemo } from "react";
import { LOAN_RATES } from "../data/cars";
import { fmt, fmtPct } from "../utils/format";

const SCENARIOS = [
  { label: "NRE FD (7%)", capRate: 7, loanRate: 8.75 },
  { label: "Break-even", capRate: 8.75, loanRate: 8.75 },
  { label: "Equity fund (12%)", capRate: 12, loanRate: 8.75 },
  { label: "Aggressive (14%)", capRate: 14, loanRate: 8.75 },
];

function calcEMI(principal, annualRate, months) {
  const r = annualRate / 100 / 12;
  return (
    (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  );
}

export default function FinanceTab() {
  const [carPrice, setCarPrice] = useState(1550000);
  const [loanRate, setLoanRate] = useState(8.75);
  const [tenure, setTenure] = useState(5);
  const [capRate, setCapRate] = useState(7);
  const [activeScenario, setActiveScenario] = useState(0);

  const result = useMemo(() => {
    const months = tenure * 12;
    const emi = calcEMI(carPrice, loanRate, months);
    const totalRepaid = emi * months;
    const interest = totalRepaid - carPrice;
    const capGrowth = carPrice * (Math.pow(1 + capRate / 100, tenure) - 1);
    const netCash = carPrice + capGrowth;
    const netLoan = totalRepaid - capGrowth;
    const principalPct = Math.round((carPrice / totalRepaid) * 100);
    const financeWins = netLoan < netCash;
    const diff = Math.abs(netCash - netLoan);
    return {
      emi,
      totalRepaid,
      interest,
      capGrowth,
      netCash,
      netLoan,
      principalPct,
      financeWins,
      diff,
    };
  }, [carPrice, loanRate, tenure, capRate]);

  const applyScenario = (idx) => {
    setActiveScenario(idx);
    setCapRate(SCENARIOS[idx].capRate);
    setLoanRate(SCENARIOS[idx].loanRate);
  };

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-label">The core question</div>
        <p className="body-text">
          With ₹1cr+ sitting in India, pulling ₹15L for the car has an
          opportunity cost. Should you finance and keep capital invested — or
          pay cash and avoid interest? The answer depends on what your money
          earns vs what the loan costs you.
        </p>
      </div>

      {/* Main calculator */}
      <div className="card">
        <div className="card-label">Finance vs cash — live model</div>

        {/* Scenario quick-pick */}
        <div className="scenario-row">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.label}
              className={`scenario-btn ${activeScenario === i ? "scenario-btn--active" : ""}`}
              onClick={() => applyScenario(i)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Sliders */}
        <div className="slider-wrap">
          <div className="slider-label">
            <span>Car price</span>
            <span className="slider-val">
              ₹{(carPrice / 100000).toFixed(2)}L
            </span>
          </div>
          <input
            type="range"
            min={1400000}
            max={1800000}
            step={50000}
            value={carPrice}
            onChange={(e) => setCarPrice(Number(e.target.value))}
            aria-label="Car price"
          />
        </div>

        <div className="slider-wrap">
          <div className="slider-label">
            <span>Loan interest rate</span>
            <span className="slider-val">{fmtPct(loanRate)}</span>
          </div>
          <input
            type="range"
            min={7.5}
            max={11.5}
            step={0.25}
            value={loanRate}
            onChange={(e) => {
              setLoanRate(Number(e.target.value));
              setActiveScenario(-1);
            }}
            aria-label="Loan interest rate"
          />
        </div>

        <div className="slider-wrap">
          <div className="slider-label">
            <span>Loan tenure</span>
            <span className="slider-val">{tenure} years</span>
          </div>
          <input
            type="range"
            min={3}
            max={7}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            aria-label="Loan tenure"
          />
        </div>

        <div className="slider-wrap">
          <div className="slider-label">
            <span>Your capital earns</span>
            <span className="slider-val">{fmtPct(capRate)} p.a.</span>
          </div>
          <input
            type="range"
            min={4}
            max={15}
            step={0.5}
            value={capRate}
            onChange={(e) => {
              setCapRate(Number(e.target.value));
              setActiveScenario(-1);
            }}
            aria-label="Capital return rate"
          />
        </div>

        {/* EMI + interest summary */}
        <div className="result-grid">
          <div className="result-card">
            <div className="rc-label">Monthly EMI</div>
            <div className="rc-val">₹{Math.round(result.emi / 1000)}K/mo</div>
            <div className="rc-sub">
              on full ₹{(carPrice / 100000).toFixed(1)}L
            </div>
          </div>
          <div className="result-card">
            <div className="rc-label">Total interest paid</div>
            <div className="rc-val">{fmt(result.interest)}</div>
            <div className="rc-sub">over {tenure} years</div>
          </div>
        </div>

        {/* Principal vs interest bar */}
        <div className="interest-bar-wrap">
          <div className="interest-bar-labels">
            <span>Principal — {result.principalPct}%</span>
            <span>Interest — {100 - result.principalPct}%</span>
          </div>
          <div className="interest-bar">
            <div
              className="interest-bar__principal"
              style={{ width: `${result.principalPct}%` }}
            />
            <div
              className="interest-bar__interest"
              style={{ width: `${100 - result.principalPct}%` }}
            />
          </div>
        </div>

        {/* Net cost comparison */}
        <div className="result-grid">
          <div
            className={`result-card ${!result.financeWins ? "result-card--winner" : "result-card--loser"}`}
          >
            <div className="rc-label">Pay cash — net cost</div>
            <div className="rc-val">{fmt(result.netCash)}</div>
            <div className="rc-sub">car + returns foregone</div>
          </div>
          <div
            className={`result-card ${result.financeWins ? "result-card--winner" : "result-card--loser"}`}
          >
            <div className="rc-label">Finance — net cost</div>
            <div className="rc-val">{fmt(result.netLoan)}</div>
            <div className="rc-sub">repaid − returns earned</div>
          </div>
        </div>

        <div className="verdict-bar">
          <div className="vb-eyebrow">Verdict</div>
          <div className="vb-main">
            {result.financeWins
              ? `Finance saves ${fmt(result.diff)} over ${tenure} years`
              : `Pay cash — saves ${fmt(result.diff)} over ${tenure} years`}
          </div>
          <div className="vb-sub">
            {result.financeWins
              ? `Your capital earns ${fmtPct(capRate)} — more than the ${fmtPct(loanRate)} loan cost. Keep the money invested, take the loan.`
              : `Loan interest (${fmtPct(loanRate)}) exceeds your capital returns (${fmtPct(capRate)}). Better to pay outright.`}
          </div>
        </div>
      </div>

      {/* Current rates reference */}
      <div className="card">
        <div className="card-label">Current rates — April 2026</div>
        <table className="kv-table">
          <tbody>
            {LOAN_RATES.map((r) => (
              <tr key={r.bank}>
                <td className="kv-label">{r.bank}</td>
                <td className="kv-val">{r.rate}</td>
                <td className="kv-note">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="warn-box">
        <strong>Important:</strong> This is illustrative analysis only. Please
        consult a CA or financial advisor before deciding, especially given NRI
        FEMA/repatriation considerations for money held in India.
      </div>
    </div>
  );
}
