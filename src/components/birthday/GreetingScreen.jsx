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
