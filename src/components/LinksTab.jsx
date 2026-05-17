import { REFERENCE_LINKS } from "../data/cars";

export default function LinksTab() {
  return (
    <div className="tab-content">
      {REFERENCE_LINKS.map((cat) => (
        <div className="card" key={cat.category}>
          <div className="card-label">{cat.category}</div>
          {cat.links.map((link) => (
            <a
              key={link.url}
              className="ref-link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-link__icon">{link.icon}</div>
              <div className="ref-link__body">
                <div className="ref-link__title">{link.title}</div>
                <div className="ref-link__src">{link.src}</div>
              </div>
              <div className="ref-link__arrow">→</div>
            </a>
          ))}
        </div>
      ))}

      <div
        style={{
          textAlign: "center",
          padding: "2rem 0 1rem",
          fontSize: 12,
          color: "var(--muted)",
          lineHeight: 1.9,
        }}
      >
        Research compiled May 2026
        <br />
        All prices ex-showroom Delhi · Verify with dealer before purchase
        <br />
        <br />
        <span style={{ color: "var(--subtle)" }}>
          Built by Ankit for the family 🙏
        </span>
      </div>
    </div>
  );
}
