import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { playerName, setPlayerName } = useOutletContext();
  const [nameInput, setNameInput] = useState(playerName);
  const trimmedName = nameInput.trim();

  const handleStart = (event) => {
    event.preventDefault();
    if (!trimmedName) {
      return;
    }

    setPlayerName(trimmedName);
    navigate('/play');
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
          Trả lời 15 câu hỏi về HTML, CSS, JavaScript và React. Mỗi câu có 20
          giây — trả lời đúng để tiếp tục chinh phục đỉnh cao.
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
      </div>
      <div className="home-info-grid">
        <article className="info-card">
          <span className="info-number">15</span>
          <h2>Câu hỏi</h2>
          <p>Trả lời lần lượt 15 câu để chinh phục chuông vàng.</p>
        </article>
        <article className="info-card">
          <span className="info-number">20</span>
          <h2>Giây mỗi câu</h2>
          <p>Chọn đáp án trước khi đồng hồ đếm ngược về không.</p>
        </article>
        <article className="info-card">
          <span className="info-number">300</span>
          <h2>Điểm tối đa</h2>
          <p>Câu khó có giá trị cao hơn: 10, 20 hoặc 30 điểm.</p>
        </article>
      </div>
    </section>
  );
};

export default Home;
