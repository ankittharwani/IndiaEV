import CarSVG from './CarSVG';
import { MODELS } from '../data/cars';

const COMPARISON_ROWS = [
  { label: 'Price from', key: 'priceLabel' },
  { label: 'BaaS available', key: 'baas', type: 'bool' },
  { label: 'Battery', key: 'battery' },
  { label: 'Claimed range', key: 'range' },
  { label: '5-star NCAP safety', key: 'ncap', type: 'bool' },
  { label: 'Reclining rear seats', key: 'recliningRear', type: 'bool' },
  { label: 'Touchscreen', key: 'screenSize' },
  { label: 'V2L charging', key: 'v2l', type: 'bool' },
  { label: 'Ventilated front seats', key: 'ventilatedSeats', type: 'bool_true' },
  { label: 'Airbags', key: 'airbags' },
  { label: 'Boot space', key: 'bootSpace', suffix: 'L' },
  { label: 'Service network', key: 'serviceNetwork' },
];

function BoolCell({ val, highlight }) {
  if (val === true) return <span className={`cell-yes${highlight ? ' cell-hi' : ''}`}>✓</span>;
  if (val === false) return <span className="cell-no">✗</span>;
  return <span>{val}</span>;
}

export default function ModelsTab() {
  return (
    <div className="tab-content">
      {/* Car cards */}
      <div className="model-card-grid">
        {MODELS.map((m) => (
          <div key={m.id} className={`model-card ${m.highlight ? 'model-card--winner' : ''}`}>
            {m.tag && (
              <div
                className="model-card__tag"
                style={{ background: m.tagStyle === 'green' ? 'var(--green-bg)' : 'var(--blue-bg)', color: m.tagColor }}
              >
                {m.tag}
              </div>
            )}
            <div className="model-card__visual" style={{ background: m.bgGradient }}>
              <CarSVG model={m.id} height={110} />
            </div>
            <div className="model-card__info">
              <div className="model-card__brand">{m.brand}</div>
              <div className="model-card__name">{m.name}</div>
              <div className="model-card__price">{m.priceLabel}</div>
              {m.baasPriceLabel && (
                <div className="model-card__baas">BaaS {m.baasPriceLabel}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Full comparison table */}
      <div className="card table-card">
        <div className="card-label">Full comparison</div>
        <div className="table-scroll">
          <table className="comp-table">
            <thead>
              <tr>
                <th className="th-feat">Feature</th>
                {MODELS.map((m) => (
                  <th key={m.id} className={m.highlight ? 'th-pick' : ''}>
                    {m.name}{m.highlight ? ' ★' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.key}>
                  <td className="td-feat">{row.label}</td>
                  {MODELS.map((m) => {
                    const val = m[row.key];
                    return (
                      <td key={m.id} className={m.highlight ? 'td-pick' : ''}>
                        {row.type === 'bool' || row.type === 'bool_true' ? (
                          <BoolCell val={val} highlight={m.highlight} />
                        ) : (
                          <span className={m.highlight && typeof val === 'string' ? 'cell-hi' : ''}>
                            {val}{row.suffix || ''}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="info-box">
        <strong>Why Windsor over Nexon?</strong> The reclining rear seats, 15.6&quot; screen, 604L boot, and BaaS via VidyutTech make Windsor Exclusive the better family car at this budget. Nexon is the safer pick if Dad travels to smaller cities regularly.
      </div>
      <div className="warn-box">
        <strong>Key trade-off:</strong> MG has no NCAP rating and a smaller service network than Tata. If service coverage outside metro areas matters, go Nexon EV.
      </div>
    </div>
  );
}
