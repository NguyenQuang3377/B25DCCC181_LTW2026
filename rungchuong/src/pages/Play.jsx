import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import ScoreBoard from '../components/ScoreBoard';
import Timer from '../components/Timer';
import { TIME_PER_QUESTION } from '../data';
import { calcScore } from '../utils';

const createAnswerRecord = (question, selectedAnswer, timedOut = false) => ({
  id: question.id,
  level: question.level,
  correct: !timedOut && selectedAnswer === question.answer,
  selectedAnswer,
  timedOut,
});

const Play = () => {
  const navigate = useNavigate();
  const { questions, loading, error, retryLoadingQuestions, playerName } =
    useOutletContext();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerState, setAnswerState] = useState('answering');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    if (answerState !== 'answering' || loading || error || !currentQuestion) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((remaining) => Math.max(remaining - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [answerState, currentQuestion, error, loading, questionIndex]);

  useEffect(() => {
    if (
      timeLeft !== 0 ||
      answerState !== 'answering' ||
      loading ||
      error ||
      !currentQuestion
    ) {
      return;
    }

    setAnswers((currentAnswers) => [
      ...currentAnswers,
      createAnswerRecord(currentQuestion, null, true),
    ]);
    setAnswerState('revealed');
  }, [answerState, currentQuestion, error, loading, timeLeft]);

  useEffect(() => {
    if (answerState !== 'locked' || loading || error) {
      return undefined;
    }

    const revealTimeout = window.setTimeout(
      () => setAnswerState('revealed'),
      2000,
    );

    return () => window.clearTimeout(revealTimeout);
  }, [answerState, error, loading, questionIndex]);

  useEffect(() => {
    if (answerState !== 'revealed' || loading || error) {
      return undefined;
    }

    const nextTimeout = window.setTimeout(() => {
      const lastAnswer = answers[answers.length - 1];
      const isLastQuestion = questionIndex === questions.length - 1;

      if (lastAnswer?.correct && !isLastQuestion) {
        setQuestionIndex((currentIndex) => currentIndex + 1);
        setSelectedAnswer(null);
        setTimeLeft(TIME_PER_QUESTION);
        setAnswerState('answering');
        return;
      }

      const reason = lastAnswer?.correct
        ? 'completed'
        : lastAnswer?.timedOut
          ? 'timeout'
          : 'wrong';

      navigate('/result', {
        replace: true,
        state: {
          playerName,
          answers,
          score: calcScore(answers),
          reason,
        },
      });
    }, 1500);

    return () => window.clearTimeout(nextTimeout);
  }, [
    answerState,
    answers,
    error,
    loading,
    navigate,
    playerName,
    questionIndex,
    questions.length,
  ]);

  if (!playerName.trim()) {
    return <Navigate replace to="/" />;
  }

  if (loading) {
    return (
      <div className="state-panel" role="status">
        <span aria-hidden="true" className="loading-spinner" />
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="state-panel state-error" role="alert">
        <h1>{error ? 'Không tải được câu hỏi' : 'Chưa có câu hỏi để thi'}</h1>
        <p>{error || 'Ngân hàng câu hỏi hiện đang trống.'}</p>
        {error && (
          <button
            className="button button-secondary"
            onClick={retryLoadingQuestions}
            type="button"
          >
            Thử tải lại
          </button>
        )}
        <button
          className="button button-primary"
          onClick={() => navigate('/')}
          type="button"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <Navigate replace to="/" />;
  }

  const handleSelectAnswer = (answerIndex) => {
    if (answerState !== 'answering' || timeLeft === 0) {
      return;
    }

    setSelectedAnswer(answerIndex);
    setAnswers((currentAnswers) => [
      ...currentAnswers,
      createAnswerRecord(currentQuestion, answerIndex),
    ]);
    setAnswerState('locked');
  };

  return (
    <section className="play-page">
      <div className="play-heading">
        <div>
          <p className="eyebrow">ĐANG THI</p>
          <h1>Chúc may mắn, {playerName}!</h1>
        </div>
        <button
          className="quit-button"
          onClick={() => navigate('/', { replace: true })}
          type="button"
        >
          Thoát lượt thi
        </button>
      </div>
      <div className="play-layout">
        <div className="play-main">
          <Timer timeLeft={timeLeft} totalTime={TIME_PER_QUESTION} />
          <QuestionCard
            answerState={answerState}
            onSelectAnswer={handleSelectAnswer}
            question={currentQuestion}
            questionIndex={questionIndex}
            selectedAnswer={selectedAnswer}
            totalQuestions={questions.length}
          />
        </div>
        <aside className="play-sidebar">
          <ScoreBoard
            answers={answers}
            currentIndex={questionIndex}
            questions={questions}
          />
          <p className="player-note">
            Người chơi: <strong>{playerName}</strong>
          </p>
        </aside>
      </div>
    </section>
  );
};

export default Play;
