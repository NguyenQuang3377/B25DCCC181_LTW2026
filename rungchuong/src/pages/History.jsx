import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

const formatPlayedAt = (playedAt) => {
  const date = new Date(playedAt);
  return Number.isNaN(date.getTime())
    ? 'Không rõ thời gian'
    : date.toLocaleString('vi-VN');
};

const History = () => {
  const { history, clearHistory } = useOutletContext();
  const sortedHistory = useMemo(
    () => [...history].sort((first, second) => second.score - first.score),
    [history],
  );
  const highestScore = history.reduce(
    (highest, entry) => Math.max(highest, entry.score),
    0,
  );
  const averageScore =
    history.length > 0
      ? Math.round(
          history.reduce((total, entry) => total + entry.score, 0) /
            history.length,
        )
      : 0;

  const handleClearHistory = () => {
    if (
      history.length > 0 &&
      window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chơi?')
    ) {
      clearHistory();
    }
  };

  return (
    <section className="history-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">THÀNH TÍCH CỦA BẠN</p>
          <h1>Lịch sử chơi</h1>
        </div>
        {history.length > 0 && (
          <button
            className="button button-danger"
            onClick={handleClearHistory}
            type="button"
          >
            Xóa lịch sử
          </button>
        )}
      </div>

      <div aria-label="Thống kê lượt chơi" className="history-stats">
        <article className="history-stat">
          <span>Số lượt chơi</span>
          <strong>{history.length}</strong>
        </article>
        <article className="history-stat">
          <span>Điểm cao nhất</span>
          <strong>{highestScore}</strong>
        </article>
        <article className="history-stat">
          <span>Điểm trung bình</span>
          <strong>{averageScore}</strong>
        </article>
      </div>

      {history.length === 0 ? (
        <div className="state-panel history-empty">
          <span aria-hidden="true" className="message-icon">
            ◷
          </span>
          <h2>Chưa có lượt chơi nào</h2>
          <p>Hãy vào thi để lưu lại thành tích của bạn.</p>
        </div>
      ) : (
        <div className="table-scroll history-table-scroll">
          <table className="question-table history-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Người chơi</th>
                <th scope="col">Số câu đúng</th>
                <th scope="col">Điểm</th>
                <th scope="col">Danh hiệu</th>
                <th scope="col">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.correctCount}</td>
                  <td className="history-score">{entry.score}</td>
                  <td>{entry.rank}</td>
                  <td>{formatPlayedAt(entry.playedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default History;
