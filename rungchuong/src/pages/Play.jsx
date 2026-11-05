import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import Helpers from '../components/Helpers';
import QuestionCard from '../components/QuestionCard';
import ScoreBoard from '../components/ScoreBoard';
import Timer from '../components/Timer';
import { EXTRA_TIME, TIME_PER_QUESTION, TOPICS } from '../data';
import {
  calcScore,
  getRank,
  shuffleArray,
  shuffleQuestionOptions,
} from '../utils';

const createAnswerRecord = (
  question,
  selectedAnswer,
  timeLeft,
  { timedOut = false, savedByLifeline = false } = {},
) => {
  const correct = !timedOut && selectedAnswer === question.answer;

  return {
    id: question.id,
    level: question.level,
    correct,
    selectedAnswer,
    timedOut,
    savedByLifeline,
    speedBonus: correct && timeLeft >= 15 ? 5 : 0,
  };
};

const Play = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    questions,
    loading,
    error,
    retryLoadingQuestions,
    playerName,
    addHistoryEntry,
  } = useOutletContext();
  const [sessionQuestions, setSessionQuestions] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerState, setAnswerState] = useState('answering');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [usedHelpers, setUsedHelpers] = useState({
    fiftyFifty: false,
    extraTime: false,
    lifeline: false,
  });
  const [lifeArmed, setLifeArmed] = useState(false);
  const recordedResult = useRef(false);
  const requestedTopic = location.state?.topic;
  const currentQuestion = sessionQuestions?.[questionIndex];

  useEffect(() => {
    if (loading || error) {
      return;
    }

    const topicQuestions =
      requestedTopic && TOPICS.includes(requestedTopic)
        ? questions.filter((question) => question.topic === requestedTopic)
        : questions;
    const preparedQuestions = shuffleArray(topicQuestions).map(
      shuffleQuestionOptions,
    );

    setSessionQuestions(preparedQuestions);
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setAnswerState('answering');
    setTimeLeft(TIME_PER_QUESTION);
    setHiddenOptions([]);
    setUsedHelpers({
      fiftyFifty: false,
      extraTime: false,
      lifeline: false,
    });
    setLifeArmed(false);
    recordedResult.current = false;
  }, [error, loading, questions, requestedTopic]);

  const handleSelectAnswer = useCallback(
    (answerIndex) => {
      if (
        answerState !== 'answering' ||
        timeLeft === 0 ||
        hiddenOptions.includes(answerIndex) ||
        !currentQuestion
      ) {
        return;
      }

      const correct = answerIndex === currentQuestion.answer;
      const savedByLifeline = lifeArmed && !correct;

      setSelectedAnswer(answerIndex);
      setAnswers((currentAnswers) => [
        ...currentAnswers,
        createAnswerRecord(currentQuestion, answerIndex, timeLeft, {
          savedByLifeline,
        }),
      ]);
      setLifeArmed(false);
      setAnswerState('locked');
    },
    [answerState, currentQuestion, hiddenOptions, lifeArmed, timeLeft],
  );

  useEffect(() => {
    if (
      !playerName.trim() ||
      loading ||
      error ||
      !currentQuestion ||
      answerState !== 'answering'
    ) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((remaining) => Math.max(remaining - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [answerState, currentQuestion, error, loading, playerName, questionIndex]);

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
      createAnswerRecord(currentQuestion, null, 0, {
        timedOut: true,
        savedByLifeline: lifeArmed,
      }),
    ]);
    setSelectedAnswer(null);
    setLifeArmed(false);
    setAnswerState('revealed');
  }, [answerState, currentQuestion, error, lifeArmed, loading, timeLeft]);

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
    if (
      answerState !== 'revealed' ||
      loading ||
      error ||
      !sessionQuestions
    ) {
      return undefined;
    }

    const nextTimeout = window.setTimeout(() => {
      const lastAnswer = answers[answers.length - 1];
      const canContinue = lastAnswer?.correct || lastAnswer?.savedByLifeline;
      const isLastQuestion = questionIndex === sessionQuestions.length - 1;

      if (canContinue && !isLastQuestion) {
        setQuestionIndex((currentIndex) => currentIndex + 1);
        setSelectedAnswer(null);
        setTimeLeft(TIME_PER_QUESTION);
        setHiddenOptions([]);
        setLifeArmed(false);
        setAnswerState('answering');
        return;
      }

      if (recordedResult.current) {
        return;
      }
      recordedResult.current = true;

      const reason = canContinue
        ? 'completed'
        : lastAnswer?.timedOut
          ? 'timeout'
          : 'wrong';
      const score = calcScore(answers);
      const result = {
        playerName,
        answers,
        score,
        reason,
        totalQuestions: sessionQuestions.length,
      };
      const historyEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: playerName,
        score,
        rank: getRank(score),
        correctCount: answers.filter((answer) => answer.correct).length,
        playedAt: new Date().toISOString(),
      };

      addHistoryEntry(historyEntry);
      navigate('/result', { replace: true, state: result });
    }, 1500);

    return () => window.clearTimeout(nextTimeout);
  }, [
    addHistoryEntry,
    answerState,
    answers,
    error,
    loading,
    navigate,
    playerName,
    questionIndex,
    sessionQuestions,
  ]);

  useEffect(() => {
    if (!playerName.trim() || !currentQuestion || !sessionQuestions) {
      return undefined;
    }

    document.title = `Câu ${questionIndex + 1}/${sessionQuestions.length} – ${calcScore(answers)} điểm`;
  }, [answers, currentQuestion, playerName, questionIndex, sessionQuestions]);

  useEffect(
    () => () => {
      document.title = 'Rung chuông vàng';
    },
    [],
  );

  useEffect(() => {
    if (answerState !== 'answering') {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (!/^[1-4]$/.test(event.key)) {
        return;
      }

      const answerIndex = Number(event.key) - 1;
      if (hiddenOptions.includes(answerIndex)) {
        return;
      }

      event.preventDefault();
      handleSelectAnswer(answerIndex);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answerState, handleSelectAnswer, hiddenOptions]);

  if (!playerName.trim()) {
    return <Navigate replace to="/" />;
  }

  if (loading || (!error && sessionQuestions === null)) {
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

  if (sessionQuestions.length === 0) {
    return (
      <div className="state-panel">
        <h1>Chủ đề này chưa có câu hỏi</h1>
        <p>Chọn chủ đề khác hoặc thi tất cả chủ đề.</p>
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

  const useFiftyFifty = () => {
    if (answerState !== 'answering' || usedHelpers.fiftyFifty) {
      return;
    }

    const wrongOptions = currentQuestion.options
      .map((option, index) => index)
      .filter((index) => index !== currentQuestion.answer);
    setHiddenOptions(shuffleArray(wrongOptions).slice(0, 2));
    setUsedHelpers((current) => ({ ...current, fiftyFifty: true }));
  };

  const addExtraTime = () => {
    if (answerState !== 'answering' || usedHelpers.extraTime) {
      return;
    }

    setTimeLeft((remaining) => remaining + EXTRA_TIME);
    setUsedHelpers((current) => ({ ...current, extraTime: true }));
  };

  const armLifeline = () => {
    if (answerState !== 'answering' || usedHelpers.lifeline) {
      return;
    }

    setLifeArmed(true);
    setUsedHelpers((current) => ({ ...current, lifeline: true }));
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
          <Timer
            timeLeft={timeLeft}
            totalTime={
              TIME_PER_QUESTION +
              (usedHelpers.extraTime ? EXTRA_TIME : 0)
            }
          />
          <QuestionCard
            answerState={answerState}
            hiddenOptions={hiddenOptions}
            onSelectAnswer={handleSelectAnswer}
            question={currentQuestion}
            questionIndex={questionIndex}
            selectedAnswer={selectedAnswer}
            totalQuestions={sessionQuestions.length}
          />
        </div>
        <aside className="play-sidebar">
          <ScoreBoard
            answers={answers}
            currentIndex={questionIndex}
            questions={sessionQuestions}
          />
          <Helpers
            answerState={answerState}
            lifeArmed={lifeArmed}
            onAddTime={addExtraTime}
            onArmLifeline={armLifeline}
            onUseFiftyFifty={useFiftyFifty}
            usedHelpers={usedHelpers}
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
