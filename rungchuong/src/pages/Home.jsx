import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { POINTS, TOPICS } from '../data';

const Home = () => {
  const navigate = useNavigate();
  const {
    playerName,
    setPlayerName,
    questions,
    loading,
    getHighScore,
    getHighScoreName,
  } = useOutletContext();
  const [nameInput, setNameInput] = useState(playerName);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const trimmedName = nameInput.trim().normalize('NFC');
  const selectedQuestions =
    selectedTopic === 'all'
      ? questions
      : questions.filter((question) => question.topic === selectedTopic);
  const maximumScore = selectedQuestions.reduce(
    (score, question) => score + POINTS[question.level] + 5,
    0,
  );

  const handleStart = (event) => {
    event.preventDefault();
    if (!trimmedName) {
      return;
    }

    setPlayerName(trimmedName);
    navigate('/play', { state: { topic: selectedTopic } });
  };

  return (
    <section className="home-page">
      <div className="home-hero">
        <span className="hero-icon" aria-hidden="true">
          ✦
        </span>
        <p className="eyebrow">SẴN SÀNG THỬ THÁCH?</p>
        <h1>Rung chuông vàng</h1>
        <p className="hero-description">
          {selectedTopic === 'all'
            ? `Trả lời ${loading ? 'các' : selectedQuestions.length} câu hỏi về HTML, CSS, JavaScript và React.`
            : `Chủ đề ${selectedTopic} có ${selectedQuestions.length} câu hỏi.`}{' '}
          Mỗi câu có 20 giây — dùng quyền trợ giúp đúng lúc để tiếp tục chinh
          phục đỉnh cao.
        </p>
        <form className="player-form" onSubmit={handleStart}>
          <label className="player-name-field" htmlFor="player-name">
            Tên người chơi
            <input
              autoComplete="name"
              id="player-name"
              maxLength={40}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Nhập tên của bạn..."
              required
              value={nameInput}
            />
          </label>
          <label className="player-name-field" htmlFor="play-topic">
            Chủ đề thi
            <select
              id="play-topic"
              onChange={(event) => setSelectedTopic(event.target.value)}
              value={selectedTopic}
            >
              <option value="all">Tất cả chủ đề</option>
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </label>
          <button
            className="button button-primary"
            disabled={!trimmedName}
            type="submit"
          >
            Vào thi
          </button>
        </form>
        <Link className="home-bank-link" to="/questions">
          Xem ngân hàng câu hỏi
        </Link>
        <p className="home-record">
          Kỷ lục:{' '}
          {getHighScore() > 0
            ? `${getHighScore()} điểm${getHighScoreName() ? ` – ${getHighScoreName()}` : ''}`
            : 'chưa có lượt chơi nào'}
        </p>
      </div>
      <div className="home-info-grid">
        <article className="info-card">
          <span className="info-number">
            {loading ? '…' : selectedQuestions.length}
          </span>
          <h2>Câu hỏi</h2>
          <p>Số câu trong chủ đề đã chọn.</p>
        </article>
        <article className="info-card">
          <span className="info-number">20</span>
          <h2>Giây mỗi câu</h2>
          <p>Chọn đáp án trước khi đồng hồ đếm ngược về không.</p>
        </article>
        <article className="info-card">
          <span className="info-number">{maximumScore}</span>
          <h2>Điểm tối đa</h2>
          <p>Đã tính tối đa 5 điểm thưởng tốc độ mỗi câu.</p>
        </article>
      </div>
    </section>
  );
};

export default Home;
