import { Link } from 'react-router-dom';

const Home = () => (
  <section className="home-page">
    <div className="home-hero">
      <span className="hero-icon" aria-hidden="true">
        ✦
      </span>
      <p className="eyebrow">SẴN SÀNG THỬ THÁCH?</p>
      <h1>Rung chuông vàng</h1>
      <p className="hero-description">
        Ôn luyện kiến thức HTML, CSS, JavaScript và React qua ngân hàng câu hỏi
        của bài thực hành Lập trình Web.
      </p>
      <Link className="button button-primary" to="/questions">
        Khám phá ngân hàng câu hỏi
      </Link>
    </div>
    <div className="home-info-grid">
      <article className="info-card">
        <span className="info-number">15</span>
        <h2>Câu hỏi</h2>
        <p>Chọn chủ đề, mức độ và tìm câu hỏi bạn muốn ôn tập.</p>
      </article>
      <article className="info-card">
        <span className="info-number">03</span>
        <h2>Mức độ</h2>
        <p>Từ Dễ đến Khó, tương ứng 10, 20 và 30 điểm.</p>
      </article>
      <article className="info-card">
        <span className="info-number">04</span>
        <h2>Chủ đề</h2>
        <p>HTML, CSS, JavaScript và React.</p>
      </article>
    </div>
  </section>
);

export default Home;
