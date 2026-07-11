import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser, saveAuthSession } from "../services/authApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({
      loading: true,
      error: "",
      success: "",
    });

    try {
      const response = await loginUser(formData);
      saveAuthSession(response.data);

      setStatus({
        loading: false,
        error: "",
        success: "Login successful. Redirecting...",
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
        <NavLink to="/" className="register-support">
          Back to home
        </NavLink>
      </header>

      <main className="register-main">
        <article className="register-card">
          <h1>Welcome back</h1>
          <p>Sign in to continue building your developer profile.</p>

          <form className="register-form" onSubmit={handleSubmit}>
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

            {status.error ? <p className="form-message form-message-error">{status.error}</p> : null}
            {status.success ? <p className="form-message form-message-success">{status.success}</p> : null}

            <button type="submit" className="register-submit" disabled={status.loading}>
              {status.loading ? "Logging in..." : "Login"}
              <span aria-hidden="true">&#8594;</span>
            </button>
          </form>

          <p className="register-footnote">
            New here? <NavLink to="/register">Create account</NavLink>
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
