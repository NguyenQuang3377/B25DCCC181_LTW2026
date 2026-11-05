import { LEVELS, POINTS } from '../data';
import AnswerButton from './AnswerButton';

const QuestionCard = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  answerState,
  hiddenOptions = [],
  onSelectAnswer,
}) => {
  const revealed = answerState === 'revealed';
  const disabled = answerState !== 'answering';

  return (
    <article className="quiz-question-card">
      <div className="quiz-question-meta">
        <span className="quiz-question-number">
          Câu {questionIndex + 1}/{totalQuestions}
        </span>
        <span>{question.topic}</span>
        <span>{LEVELS[question.level]}</span>
        <span>{POINTS[question.level]} điểm</span>
      </div>
      <h2 className="quiz-question-title">{question.question}</h2>
      <div className="quiz-answer-grid">
        {question.options.map((option, index) => (
          <AnswerButton
            correct={index === question.answer}
            disabled={disabled}
            hidden={hiddenOptions.includes(index)}
            index={index}
            key={`${question.id}-${index}`}
            onSelect={onSelectAnswer}
            option={option}
            revealed={revealed}
            selected={selectedAnswer === index}
          />
        ))}
      </div>
      {answerState === 'locked' && (
        <p className="quiz-feedback" role="status">
          Đã khóa đáp án. Đang kiểm tra...
        </p>
      )}
      {revealed && (
        <p
          className={
            selectedAnswer === question.answer
              ? 'quiz-feedback feedback-correct'
              : 'quiz-feedback feedback-wrong'
          }
          role="status"
        >
          {selectedAnswer === null
            ? 'Hết giờ! Đáp án đúng được đánh dấu màu xanh.'
            : selectedAnswer === question.answer
              ? 'Chính xác! Bạn được cộng điểm.'
              : 'Chưa chính xác. Đáp án đúng được đánh dấu màu xanh.'}
        </p>
      )}
    </article>
  );
};

export default QuestionCard;
