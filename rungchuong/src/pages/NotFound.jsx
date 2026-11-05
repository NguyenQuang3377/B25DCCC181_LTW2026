import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="message-page">
    <span className="not-found-code">404</span>
    <p className="eyebrow">KHÔNG TÌM THẤY TRANG</p>
    <h1>Đường dẫn này không tồn tại</h1>
    <p>Kiểm tra lại địa chỉ hoặc quay về trang chủ.</p>
    <Link className="button button-primary" to="/">
      Về trang chủ
    </Link>
  </section>
);

export default NotFound;
