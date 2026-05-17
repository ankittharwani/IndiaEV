import { useState, useMemo } from 'react';
import { BAAS_FINANCIERS } from '../data/cars';
import { fmt, fmtKm } from '../utils/format';

const PETROL_RATE = 105;
const PETROL_MILEAGE = 14;
const BATTERY_RATE = 3.5;
const CHARGING_RATE = 1;

export default function BaasTab() {
  const [km, setKm] = useState(1100);

  const calcs = useMemo(() => {
    const rent = km * BATTERY_RATE;
    const elec = km * CHARGING_RATE;
    const total = rent + elec;
    const annual = rent * 12;
    const petrol = (km / PETROL_MILEAGE) * PETROL_RATE;
    const saving = petrol - total;
    return { rent, elec, total, annual, petrol, saving };
  }, [km]);

  const isLowMileage = km <= 1500;

  return (
    <div className="tab-content">
      {/* Explainer */}
      <div className="card">
        <div className="card-label">What is BaaS?</div>
        <p className="body-text">
          Battery-as-a-Service separates the battery cost from the car. You buy the car at a lower upfront price (without the battery), then pay per km for battery usage. VidyutTech owns the battery and covers all malfunctions under a <strong>lifetime warranty</strong> — battery replacement risk is entirely theirs.
        </p>
        <div className="baas-quick-stats">
          <div className="baas-stat">
            <div className="baas-stat__val">₹3.5</div>
            <div className="baas-stat__label">per km (VidyutTech)</div>
          </div>
          <div className="baas-stat">
            <div className="baas-stat__val">0</div>
            <div className="baas-stat__label">minimum monthly km</div>
          </div>
          <div className="baas-stat">
            <div className="baas-stat__val">∞</div>
            <div className="baas-stat__label">km battery warranty</div>
          </div>
        </div>
      </div>

      {/* Live calculator */}
      <div className="card">
        <div className="card-label">Your monthly cost — live calculator</div>
        <div className="slider-wrap">
          <div className="slider-label">
            <span>Monthly km driven</span>
            <span className="slider-val">{fmtKm(km)}</span>
          </div>
          <input
            type="range"
            min={500}
            max={3000}
            step={100}
            value={km}
            onChange={(e) => setKm(Number(e.target.value))}
            aria-label="Monthly kilometres driven"
          />
          <div className="slider-ticks">
            <span>500 km</span>
            <span>1,500 km</span>
            <span>3,000 km</span>
          </div>
        </div>

        <div className="result-grid">
          <div className="result-card">
            <div className="rc-label">Battery rental</div>
            <div className="rc-val">{fmt(calcs.rent)}</div>
            <div className="rc-sub">₹3.5 × {km.toLocaleString('en-IN')} km</div>
          </div>
          <div className="result-card">
            <div className="rc-label">Electricity (~₹1/km)</div>
            <div className="rc-val">{fmt(calcs.elec)}</div>
            <div className="rc-sub">home charging estimate</div>
          </div>
          <div className="result-card result-card--winner">
            <div className="rc-label">Total monthly EV cost</div>
            <div className="rc-val">{fmt(calcs.total)}</div>
            <div className="rc-sub">battery + electricity</div>
          </div>
          <div className="result-card">
            <div className="rc-label">Annual battery cost</div>
            <div className="rc-val">{fmt(calcs.annual)}</div>
            <div className="rc-sub">VidyutTech subscription</div>
          </div>
        </div>

        <div className={isLowMileage ? 'info-box' : 'note-box'}>
          {isLowMileage ? (
            <>At {fmtKm(km)}, <strong>VidyutTech is ideal</strong> — you pay only {fmt(calcs.rent)}/month with no minimum penalty. Bajaj/Hero would charge ₹5,250 regardless.</>
          ) : (
            <>At {fmtKm(km)}, <strong>Bajaj Finance</strong> may also work — fixed ₹5,250/month, no penalty for exceeding 1,500 km. Compare both before deciding.</>
          )}
        </div>
      </div>

      {/* vs Petrol */}
      <div className="card">
        <div className="card-label">vs. Running a petrol SUV</div>
        <div className="petrol-compare">
          <div className="petrol-row">
            <span>Petrol cost (₹105/L, 14 km/L)</span>
            <span className="petrol-row__val petrol-row__val--bad">{fmt(calcs.petrol)}/mo</span>
          </div>
          <div className="petrol-row">
            <span>Windsor EV total monthly running</span>
            <span className="petrol-row__val petrol-row__val--good">{fmt(calcs.total)}/mo</span>
          </div>
          <div className="petrol-row petrol-row--total">
            <span><strong>Monthly savings vs petrol</strong></span>
            <span className={`petrol-row__val ${calcs.saving > 0 ? 'petrol-row__val--good' : 'petrol-row__val--bad'}`}>
              {calcs.saving > 0 ? fmt(calcs.saving) : '-' + fmt(-calcs.saving)}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Financier cards */}
      <div className="card">
        <div className="card-label">All BaaS financiers — Windsor EV</div>
        {BAAS_FINANCIERS.map((f) => (
          <div key={f.id} className={`fin-card ${f.recommended ? 'fin-card--pick' : ''}`}>
            <span className={`badge badge--${f.badgeType}`}>{f.badge}</span>
            <h4 className="fin-card__name">{f.name}</h4>
            <p className="fin-card__notes">{f.notes}</p>
          </div>
        ))}
      </div>

      <div className="note-box">
        <strong>Confirm with MG dealer:</strong> Security deposit amount · Tenure options (3 or 5 year) · Buyout terms if you want to own the battery later · What happens to the subscription at resale
      </div>
    </div>
  );
}
