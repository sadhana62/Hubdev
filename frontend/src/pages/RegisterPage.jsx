import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser, saveAuthSession } from "../services/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        loading: false,
        error: "Passwords do not match",
        success: "",
      });
      return;
    }

    if (!formData.terms) {
      setStatus({
        loading: false,
        error: "Please accept the terms to continue",
        success: "",
      });
      return;
    }

    setStatus({
      loading: true,
      error: "",
      success: "",
    });

    try {
      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        bio: formData.bio || formData.fullName,
      });

      saveAuthSession(response.data);
      setStatus({
        loading: false,
        error: "",
        success: "Account created. Redirecting...",
      });

      setTimeout(() => {
        navigate("/");
      }, 600);
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message,
        success: "",
      });
    }
  };

  return (
    <section className="register-page">
      <header className="register-header">
        <div className="register-brand">
          <span className="register-brand-icon">&#x2328;</span>
          <strong>DevHub</strong>
        </div>
        <NavLink to="/login" className="register-support">
          Login
        </NavLink>
      </header>

      <main className="register-main">
        <article className="register-card">
          <h1>Join DevHub</h1>
          <p>Connect with the world&apos;s best developers.</p>

          <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="fullName">Full Name</label>
            <div className="input-wrap">
              <span>&#128100;</span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Linus Torvalds"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <span>@</span>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="linus_t"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <span>&#9993;</span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <label htmlFor="bio">Bio</label>
            <div className="input-wrap">
              <span>&#9998;</span>
              <input
                id="bio"
                name="bio"
                type="text"
                placeholder="Building tools and sharing ideas"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="dual-fields">
              <div>
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <span>&#128274;</span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="........"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword">Confirm</label>
                <div className="input-wrap">
                  <span>&#128737;</span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="........"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <label className="check-row" htmlFor="terms">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
              />
              <span>I accept the Terms and Privacy Policy.</span>
            </label>

            {status.error ? <p className="form-message form-message-error">{status.error}</p> : null}
            {status.success ? <p className="form-message form-message-success">{status.success}</p> : null}

            <button type="submit" className="register-submit" disabled={status.loading}>
              {status.loading ? "Creating Account..." : "Create Account"}
              <span aria-hidden="true">&#8594;</span>
            </button>
          </form>

          <p className="register-footnote">
            Already have an account? <NavLink to="/login">Login</NavLink>
          </p>
        </article>
      </main>

      <footer className="register-footer">
        <div>
          <strong>DevHub</strong>
          <p>&copy; 2024 DevHub Inc. Built for developers by developers.</p>
        </div>

        <nav aria-label="Footer links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">API</a>
          <a href="#">GitHub</a>
        </nav>
      </footer>
    </section>
  );
}
