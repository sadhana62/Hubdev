import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import StackPage from "./pages/StackPage.jsx";
import StatusPage from "./pages/StatusPage.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { clearAuthSession, getAuthSession } from "./services/authApi";

const links = [
  { to: "/", label: "Explore" },
  { to: "/stack", label: "Projects" },
  { to: "/search", label: "Community" }
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authSession, setAuthSession] = useState(() => getAuthSession());
  
  const isAuthPage = location.pathname === "/register" || location.pathname === "/login";
  const isFeedActive = authSession?.user && location.pathname === "/";
  const showHeader = !isAuthPage && !isFeedActive;

  useEffect(() => {
    setAuthSession(getAuthSession());
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthSession();
    setAuthSession(null);
    navigate("/login");
  };

  return (
    <div className={isAuthPage ? "app-frame register-frame min-h-screen" : "app-frame min-h-screen bg-[#0f172a]"}>
      {showHeader ? (
        <header className="bg-surface/70 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-white/10 shadow-sm">
          <div className="flex justify-between items-center h-16 px-margin-desktop max-w-max-width mx-auto w-full">
            <div className="flex items-center gap-xl">
              <NavLink className="font-headline-md text-headline-md font-bold text-on-surface tracking-tighter" to="/">
                DevHub
              </NavLink>
              <nav className="hidden md:flex gap-lg items-center">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      isActive
                        ? "text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md"
                        : "text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 font-label-md text-label-md"
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-md">
              {authSession?.user ? (
                <>
                  <span className="hidden sm:block text-on-surface-variant font-medium text-label-md mr-2">
                    Hi, {authSession.user.username}
                  </span>
                  <button
                    className="bg-white/5 border border-white/10 text-on-surface hover:bg-white/10 font-bold px-lg py-sm rounded-lg active:opacity-80 active:scale-95 transition-all font-label-md text-label-md cursor-pointer"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    className="hidden sm:block text-on-surface-variant font-medium hover:text-on-surface px-md py-sm transition-all font-label-md text-label-md"
                    to="/login"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    className="bg-primary text-on-primary font-bold px-lg py-sm rounded-lg active:opacity-80 active:scale-95 transition-all font-label-md text-label-md cursor-pointer text-center"
                    to="/register"
                  >
                    Create Account
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </header>
      ) : null}

      <main className={showHeader ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={authSession?.user ? <FeedPage /> : <HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/stack" element={<StackPage />} />
          <Route path="/search" element={<StatusPage />} />
          <Route path="/profile" element={authSession?.user ? <ProfilePage /> : <LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}
