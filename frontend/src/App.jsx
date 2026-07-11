import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import StackPage from "./pages/StackPage.jsx";
import StatusPage from "./pages/StatusPage.jsx";

const links = [
  { to: "/", label: "Explore" },
  { to: "/stack", label: "Projects" },
  { to: "/status", label: "Community" }
];

export default function App() {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className={isRegisterPage ? "app-frame register-frame" : "app-frame"}>
      {!isRegisterPage ? (
        <header className="site-header">
          <div className="brand">DevHub</div>

          <nav className="site-nav" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "site-nav-link site-nav-link-active" : "site-nav-link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-actions">
            <button className="btn btn-ghost" type="button">
              Login
            </button>
            <NavLink className="btn btn-solid" to="/register">
              Create Post
            </NavLink>
          </div>
        </header>
      ) : null}

      <main className="site-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/stack" element={<StackPage />} />
          <Route path="/search" element={<StatusPage />} />
          
        </Routes>
      </main>
    </div>
  );
}
