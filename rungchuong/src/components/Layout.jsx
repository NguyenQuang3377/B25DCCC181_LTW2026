import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ outletContext }) => (
  <div className="app-shell">
    <header className="site-header">
      <div className="header-content">
        <p className="eyebrow">LẬP TRÌNH WEB · BÀI THỰC HÀNH</p>
        <NavBar />
      </div>
    </header>
    {outletContext.historyError && (
      <div className="storage-notice" role="alert">
        Không thể đồng bộ lịch sử: {outletContext.historyError}
      </div>
    )}
    <main className="page-content">
      <Outlet context={outletContext} />
    </main>
    <footer className="site-footer">Rung chuông vàng · LTW2026</footer>
  </div>
);

export default Layout;
