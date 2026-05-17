import { useState } from "react";

export default function QuizCard({ question, index, total, onNext }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const correct = question.answer;

  function handleSelect(option) {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);

    const isCorrect = option === correct;
    setTimeout(
      () => onNext({ correct: isCorrect, selected: option }),
      isCorrect ? 1200 : 1800,
    );
  }

  function optionClass(option) {
    if (!revealed) return "bday-option";
    if (option === correct) return "bday-option bday-option--correct";
    if (option === selected) return "bday-option bday-option--wrong";
    return "bday-option bday-option--dim";
  }

  return (
    <div className="bday-screen bday-quiz">
      <div className="bday-quiz__card">
        <div className="bday-quiz__badge">
          <span className="bday-quiz__emoji">{question.emoji}</span>
          <span className="bday-quiz__category">{question.category}</span>
        </div>

        <p className="bday-quiz__question">{question.question}</p>

        <div className="bday-quiz__options">
          {question.options.map((opt) => (
            <button
              key={opt}
              className={optionClass(opt)}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
            >
              {opt}
            </button>
          ))}
        </div>

        {revealed && (
          <p
            className={`bday-quiz__feedback ${selected === correct ? "bday-quiz__feedback--correct" : "bday-quiz__feedback--wrong"}`}
          >
            {selected === correct ? "Correct! ✓" : `The answer is: ${correct}`}
          </p>
        )}

        <p className="bday-quiz__progress">
          Question {index + 1} of {total}
        </p>
      </div>
    </div>
  );
}
