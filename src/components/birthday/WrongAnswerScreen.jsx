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
