import { useState } from "react";
import { QUIZ_QUESTIONS } from "../../data/quiz";
import GreetingScreen from "./GreetingScreen";
import QuizCard from "./QuizCard";
import WrongAnswerScreen from "./WrongAnswerScreen";
import RevealScreen from "./RevealScreen";

export default function BirthdayFlow({ onComplete }) {
  const [step, setStep] = useState("greeting");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(null);

  if (step === "greeting") {
    return <GreetingScreen onStart={() => setStep("quiz")} />;
  }

  if (step === "wrong") {
    return (
      <WrongAnswerScreen
        wrongAnswer={wrongAnswer}
        onRetry={() => {
          setWrongAnswer(null);
          setStep("quiz");
        }}
      />
    );
  }

  if (step === "reveal") {
    return <RevealScreen onExplore={onComplete} />;
  }

  const question = QUIZ_QUESTIONS[questionIndex];

  function handleNext({ correct, selected }) {
    if (question.isReveal) {
      if (correct) {
        setStep("reveal");
      } else {
        setWrongAnswer(selected);
        setStep("wrong");
      }
      return;
    }
    setQuestionIndex((i) => i + 1);
  }

  return (
    <QuizCard
      key={question.id}
      question={question}
      index={questionIndex}
      total={QUIZ_QUESTIONS.length}
      onNext={handleNext}
    />
  );
}
