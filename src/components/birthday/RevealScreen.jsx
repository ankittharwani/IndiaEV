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
          A drive · hydroelectric · silent · a jeep · charging · your Amaze ·
          lithium
        </p>

        <button className="bday-btn bday-btn--primary" onClick={onExplore}>
          Explore your car →
        </button>
      </div>
    </div>
  );
}
