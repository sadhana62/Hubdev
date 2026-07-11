import { NavLink } from "react-router-dom";

export default function LoginPage() {
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

          <form className="register-form" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="loginEmail">Email or username</label>
            <div className="input-wrap">
              <span>&#9993;</span>
              <input
                id="loginEmail"
                name="loginEmail"
                type="text"
                placeholder="name@company.com or username"
              />
            </div>

            <label htmlFor="loginPassword">Password</label>
            <div className="input-wrap">
              <span>&#128274;</span>
              <input id="loginPassword" name="loginPassword" type="password" placeholder="........" />
            </div>

            <button type="submit" className="register-submit">
              Login
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