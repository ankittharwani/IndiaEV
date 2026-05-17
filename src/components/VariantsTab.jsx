import { WINDSOR_VARIANTS, VARIANT_FEATURE_ROWS } from '../data/cars';

function FeatureCell({ val, type }) {
  if (type === 'bool') {
    return val
      ? <span className="vc vc--yes">✓</span>
      : <span className="vc vc--no">✗</span>;
  }
  return <span className="vc vc--txt">{val}</span>;
}

export default function VariantsTab() {
  return (
    <div className="tab-content">
      {/* Variant header cards */}
      <div className="variant-header-grid">
        {WINDSOR_VARIANTS.map((v) => (
          <div key={v.id} className={`variant-chip ${v.recommended ? 'variant-chip--pick' : ''}`}>
            <div className="variant-chip__tier">{v.tier}</div>
            <div className="variant-chip__name">{v.name}</div>
            <div className="variant-chip__price">{v.priceLabel}</div>
            {v.recommended && <div className="variant-chip__badge">★ Our pick</div>}
          </div>
        ))}
      </div>

      {/* Feature comparison */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid var(--border)' }}>
          <div className="card-label" style={{ margin: 0 }}>Feature breakdown</div>
          <div className="variant-col-headers">
            {WINDSOR_VARIANTS.map((v) => (
              <div key={v.id} className={`variant-col-header ${v.recommended ? 'variant-col-header--pick' : ''}`}>
                {v.name}
              </div>
            ))}
          </div>
        </div>

        {['Cabin & comfort', 'Tech & infotainment', 'Charging'].map((section) => {
          const sectionKeys = {
            'Cabin & comfort': ['recliningRear', 'leather', 'ventilatedSeats', 'powerSeat', 'glassRoof', 'ambientLighting'],
            'Tech & infotainment': ['screenSize', 'cluster', 'iSmart', 'wirelessCharge', 'speakers', 'camera360'],
            'Charging': ['fastChargerBundled', 'maxDCCharge'],
          };
          const rows = VARIANT_FEATURE_ROWS.filter((r) => sectionKeys[section].includes(r.key));

          return (
            <div key={section}>
              <div className="variant-section-label">{section}</div>
              {rows.map((row) => (
                <div key={row.key} className="var-row">
                  <div className="var-feat">{row.label}</div>
                  <div className="var-cols">
                    {WINDSOR_VARIANTS.map((v) => (
                      <FeatureCell key={v.id} val={v.features[row.key]} type={row.type} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="info-box">
        <strong>Why Exclusive over Excite?</strong> The ₹1.43L jump unlocks reclining rear seats, the 15.6&quot; screen, leather seats, i-Smart, power seat, and wireless charging. Excite skips the two features that define Windsor.
      </div>
      <div className="note-box">
        <strong>Is Essence worth ₹1L more?</strong> The glass roof, 9-speaker Infinity system, and bundled 7.4 kW charger (saves ~₹30–40K separately) are genuinely premium. Worth it if the family loves the open-sky feel — otherwise Exclusive is enough.
      </div>
    </div>
  );
}
