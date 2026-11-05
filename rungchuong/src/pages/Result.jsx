import { Link, Navigate, useLocation } from 'react-router-dom';
import { calcScore, getRank } from '../utils';

const Result = () => {
  const location = useLocation();
  const result = location.state;

  if (
    !result ||
    typeof result.playerName !== 'string' ||
    !Array.isArray(result.answers)
  ) {
    return <Navigate replace to="/" />;
  }

  const score = calcScore(result.answers);
  const correctCount = result.answers.filter((answer) => answer.correct).length;
  const title =
    result.reason === 'completed'
      ? 'Chúc mừng! Bạn đã rung chuông vàng'
      : result.reason === 'timeout'
        ? 'Hết giờ! Bạn đã bị loại'
        : 'Bạn đã bị loại';
  const subtitle =
    result.reason === 'completed'
      ? 'Bạn đã trả lời đúng cả 15 câu hỏi.'
      : result.reason === 'timeout'
        ? 'Bạn không chọn đáp án trước khi hết giờ.'
        : 'Câu trả lời chưa chính xác nên lượt chơi kết thúc.';

  return (
    <section className="result-page">
      <div className="result-hero">
        <span
          aria-hidden="true"
          className={
            result.reason === 'completed'
              ? 'result-medal result-medal-winner'
              : 'result-medal'
          }
        >
          {result.reason === 'completed' ? '★' : '✦'}
        </span>
        <p className="eyebrow">KẾT QUẢ LƯỢT CHƠI</p>
        <h1>{title}</h1>
        <p className="result-subtitle">{subtitle}</p>
        <p className="result-player">
          Người chơi: <strong>{result.playerName}</strong>
        </p>
      </div>

      <div aria-label="Tổng kết điểm" className="result-stats">
        <article className="result-stat">
          <span>Số câu trả lời đúng</span>
          <strong>{correctCount}</strong>
        </article>
        <article className="result-stat">
          <span>Điểm</span>
          <strong>{score}</strong>
        </article>
        <article className="result-stat">
          <span>Danh hiệu</span>
          <strong>{getRank(score)}</strong>
        </article>
      </div>

      <div className="result-actions">
        <Link className="button button-primary" to="/play">
          Chơi lại
        </Link>
        <Link className="button button-secondary" to="/">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
};

export default Result;
