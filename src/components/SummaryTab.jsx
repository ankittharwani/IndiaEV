import CarSVG from './CarSVG';

const STEPS = [
  {
    n: 1,
    title: 'Shortlisted: Punch EV, Nexon EV, Windsor EV',
    body: 'Windsor Exclusive beats Nexon on cabin luxury and rear comfort — the defining factor for daily family use. Nexon wins on NCAP safety and service network; Windsor wins on experience.',
  },
  {
    n: 2,
    title: 'BaaS: VidyutTech is the only sensible option',
    body: 'At ~1,100 km/month, Bajaj/Hero Fincorp ₹5,250 minimum makes no sense. VidyutTech charges exactly what you drive — ₹3.5/km, zero minimum. True pay-as-you-go.',
  },
  {
    n: 3,
    title: 'Exclusive is the sweet spot within Windsor',
    body: 'Excite skips the reclining rear seats and 15.6" screen — the core Windsor features. Essence adds the glass roof for ₹1L more. Exclusive gets everything that matters.',
  },
  {
    n: 4,
    title: 'Finance if capital earns above ~8.75%',
    body: 'NRE FD at 7% → pay cash saves ~₹1.5L. Equity funds at 12% → finance wins by ~₹4L. The break-even is approximately the car loan rate itself.',
  },
];

const KEY_NUMBERS = [
  ['Car (Windsor Exclusive, ex-showroom)', '₹15.53L'],
  ['BaaS car price (without battery)', '~₹10.5L*'],
  ['Battery rental — VidyutTech', '₹3.5/km'],
  ['Monthly cost @ 1,100 km (battery + charging)', '~₹4,950'],
  ['Range claimed (38 kWh)', '332 km'],
  ['DC fast charge 0→80% (45 kW)', '55 min'],
  ['Home charge 0→100% (3.3 kW, bundled)', '~15 hr'],
];

export default function SummaryTab() {
  return (
    <div className="tab-content">
      <div className="verdict-bar">
        <div className="vb-eyebrow">Our recommendation</div>
        <div className="vb-main">MG Windsor EV Exclusive + VidyutTech BaaS</div>
        <div className="vb-sub">
          ₹9.99L upfront (BaaS) · ₹3.5/km battery, no minimum · ~₹27K/month EMI if financed · lifetime battery warranty
        </div>
      </div>

      <div className="card car-hero-card">
        <div className="car-hero-visual">
          <CarSVG model="windsor" />
        </div>
        <div className="car-hero-info">
          <div>
            <div className="car-hero-name">Windsor EV Exclusive</div>
            <div className="car-hero-spec">38 kWh · 136 PS · 2,700mm wheelbase · 604L boot</div>
          </div>
          <div className="car-hero-price-block">
            <div className="car-hero-price">₹15.53L</div>
            <div className="car-hero-baas">BaaS: ~₹10.5L + ₹3.5/km</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-label">Decision journey</div>
        {STEPS.map((s) => (
          <div className="step" key={s.n}>
            <div className="step-num">{s.n}</div>
            <div>
              <h4 className="step-title">{s.title}</h4>
              <p className="step-body">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-label">Key numbers at a glance</div>
        <table className="kv-table">
          <tbody>
            {KEY_NUMBERS.map(([label, val]) => (
              <tr key={label}>
                <td className="kv-label">{label}</td>
                <td className="kv-val">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="footnote">*Exclusive BaaS price approx — confirm with MG dealer. Standard ₹9.99L is for base Windsor.</p>
      </div>
    </div>
  );
}
