import { NavLink } from 'react-router-dom';

const NavBar = () => (
  <nav className="main-nav" aria-label="Điều hướng chính">
    <NavLink
      end
      to="/"
      className={({ isActive }) =>
        isActive ? 'nav-link nav-link-active' : 'nav-link'
      }
    >
      Trang chủ
    </NavLink>
    <NavLink
      to="/questions"
      className={({ isActive }) =>
        isActive ? 'nav-link nav-link-active' : 'nav-link'
      }
    >
      Ngân hàng câu hỏi
    </NavLink>
    <NavLink
      to="/history"
      className={({ isActive }) =>
        isActive ? 'nav-link nav-link-active' : 'nav-link'
      }
    >
      Lịch sử
    </NavLink>
  </nav>
);

export default NavBar;
