import { calcScore } from '../utils';

const ScoreBoard = ({ answers, currentIndex, questions }) => {
  const score = calcScore(answers);

  return (
    <section aria-label="Bảng điểm và tiến độ" className="scoreboard-card">
      <div className="scoreboard-summary">
        <div>
          <span className="scoreboard-label">Điểm hiện tại</span>
          <strong className="scoreboard-score">{score}</strong>
        </div>
        <div className="scoreboard-progress-label">
          Câu {currentIndex + 1}/{questions.length}
        </div>
      </div>
      <div className="question-progress" aria-label="Tiến độ câu hỏi">
        {questions.map((question, index) => {
          const answer = answers[index];
          const stateClass = answer
            ? answer.correct
              ? 'progress-correct'
              : 'progress-incorrect'
            : '';

          return (
            <span
              aria-current={index === currentIndex ? 'step' : undefined}
              aria-label={`Câu ${index + 1}${
                answer
                  ? answer.correct
                    ? ', trả lời đúng'
                    : ', trả lời sai'
                  : index === currentIndex
                    ? ', đang thi'
                    : ', chưa làm'
              }`}
              className={`progress-dot${stateClass ? ` ${stateClass}` : ''}${
                index === currentIndex ? ' progress-current' : ''
              }`}
              key={question.id}
            />
          );
        })}
      </div>
      <div className="scoreboard-legend">
        <span>
          <i className="legend-dot legend-correct" /> Đúng
        </span>
        <span>
          <i className="legend-dot legend-current" /> Đang làm
        </span>
        <span>
          <i className="legend-dot legend-pending" /> Chưa làm
        </span>
      </div>
    </section>
  );
};

export default ScoreBoard;
