import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useEffect } from "react";
import { getCurrentAdmin, logoutAdmin } from "../../service/Auth";

const Header = () => {
  const navigate = useNavigate();
  const admin = getCurrentAdmin();

  useEffect(() => {
    if (!admin) {
      navigate("/");
    }
  }, [admin, navigate]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap").catch(e => console.log("Bootstrap load error:", e));
    }
  }, []);

  const { theme, handleDarkModeToggle } = useDarkMode();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <header className="header-area shadow-sm" id="headerArea">
      <div className="container">
        <div className="header-content header-style-two position-relative d-flex align-items-center justify-content-between py-3">
          {/* Logo Wrapper */}
          <div className="logo-wrapper">
            {/* <Link to="/home" className="d-flex align-items-center text-decoration-none">
              <img
                src="/assets/img/core-img/logo.png"
                alt="Logo"
                className="img-fluid"
                style={{ maxHeight: '40px' }}
              />
            </Link> */}
            <Link to="/home" className="d-flex align-items-center text-decoration-none">
              <div className="d-flex flex-column align-items-start justify-content-center"
                style={{
                  minHeight: '40px',
                  minWidth: '160px'
                }}>
                <h4 className="mb-0 fw-bold">BINTANGMAS 1</h4>
                <small className="m-0 text-muted">Tengah Modo</small>
              </div>
            </Link>
          </div>

          {/* Navbar Content */}
          <div className="navbar-content-wrapper d-flex align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <div className="night-mode-nav d-flex align-items-center">
              <label
                htmlFor="darkSwitch"
                className="form-label mb-0 me-2 text-muted"
                style={{ fontSize: '0.85rem' }}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </label>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  id="darkSwitch"
                  type="checkbox"
                  checked={theme === "dark"}
                  onChange={handleDarkModeToggle}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Admin Info & Logout */}
            {admin && (
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-primary dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="adminDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  <span className="d-none d-md-inline">Admin</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;