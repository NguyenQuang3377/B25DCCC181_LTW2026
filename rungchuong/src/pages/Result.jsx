import { Link, Navigate, useLocation } from 'react-router-dom';
import { POINTS } from '../data';
import { calcScore, getRank } from '../utils';

const isValidResult = (result) =>
  result &&
  typeof result.playerName === 'string' &&
  Array.isArray(result.answers) &&
  result.answers.length > 0 &&
  result.answers.every(
    (answer) =>
      Object.prototype.hasOwnProperty.call(POINTS, answer.level) &&
      (answer.selectedAnswer === null ||
        Number.isInteger(answer.selectedAnswer)) &&
      typeof answer.correct === 'boolean',
  ) &&
  Number.isInteger(result.totalQuestions) &&
  ['completed', 'timeout', 'wrong'].includes(result.reason);

const Result = () => {
  const location = useLocation();
  const result = location.state;

  if (!isValidResult(result)) {
    return <Navigate replace to="/" />;
  }

  const score = calcScore(result.answers);
  const correctCount = result.answers.filter((answer) => answer.correct).length;
  const savedCount = result.answers.filter(
    (answer) => answer.savedByLifeline,
  ).length;
  const speedBonusCount = result.answers.filter(
    (answer) => answer.speedBonus > 0,
  ).length;
  const title =
    result.reason === 'completed'
      ? 'Chúc mừng! Bạn đã hoàn thành lượt chơi'
      : result.reason === 'timeout'
        ? 'Hết giờ! Bạn đã bị loại'
        : 'Bạn đã bị loại';
  const subtitle =
    result.reason === 'completed'
      ? `Bạn đã hoàn thành ${result.totalQuestions} câu hỏi${
          savedCount > 0 ? `, dùng phao cứu sinh ${savedCount} lần` : ''
        }.`
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
          {result.reason === 'completed' ? '🔔' : '✦'}
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

      {(savedCount > 0 || speedBonusCount > 0) && (
        <p className="result-bonus-summary">
          {savedCount > 0 && `Đã dùng phao cứu sinh: ${savedCount} lần.`}
          {savedCount > 0 && speedBonusCount > 0 ? ' ' : ''}
          {speedBonusCount > 0 &&
            `Thưởng tốc độ: +${speedBonusCount * 5} điểm.`}
        </p>
      )}

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
