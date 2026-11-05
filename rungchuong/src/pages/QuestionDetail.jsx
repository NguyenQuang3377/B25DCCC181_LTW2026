import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { LETTERS, LEVELS, POINTS } from '../data';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { questions, loading, error, retryLoadingQuestions } =
    useOutletContext();
  const question = questions.find((item) => item.id === Number(id));

  if (loading) {
    return (
      <div className="state-panel" role="status">
        <span className="loading-spinner" aria-hidden="true" />
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-panel state-error" role="alert">
        <h1>Không tải được câu hỏi</h1>
        <p>{error}</p>
        <button
          className="button button-secondary"
          onClick={retryLoadingQuestions}
          type="button"
        >
          Thử tải lại
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <section className="message-page">
        <span className="not-found-code">?</span>
        <p className="eyebrow">NGÂN HÀNG CÂU HỎI</p>
        <h1>Không tìm thấy câu hỏi</h1>
        <p>Câu hỏi số {id} không tồn tại trong ngân hàng câu hỏi.</p>
        <button
          className="button button-primary"
          onClick={() => navigate('/questions')}
          type="button"
        >
          Quay lại ngân hàng câu hỏi
        </button>
      </section>
    );
  }

  return (
    <section className="question-detail-page">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
        type="button"
      >
        <span aria-hidden="true">←</span> Quay lại
      </button>
      <article className="detail-card">
        <div className="question-card-meta">
          <span className="question-id">Câu hỏi số {question.id}</span>
          <span className="topic-badge">{question.topic}</span>
          <span className={`level-badge level-${question.level}`}>
            {LEVELS[question.level]}
          </span>
          <span className="question-points">
            {POINTS[question.level]} điểm
          </span>
        </div>
        <h1 className="detail-question">{question.question}</h1>
        <div className="answer-list">
          {question.options.map((option, index) => {
            const isCorrect = index === question.answer;

            return (
              <div
                className={
                  isCorrect ? 'answer-option answer-correct' : 'answer-option'
                }
                key={`${question.id}-${LETTERS[index]}`}
              >
                <span className="answer-letter">{LETTERS[index]}</span>
                <span className="answer-text">{option}</span>
                {isCorrect && (
                  <span className="correct-label">Đáp án đúng</span>
                )}
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
};

export default QuestionDetail;
