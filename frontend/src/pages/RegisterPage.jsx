export default function RegisterPage() {
  return (
    <section className="register-page">
      <header className="register-header">
        <div className="register-brand">
          <span className="register-brand-icon">&#x2328;</span>
          <strong>DevHub</strong>
        </div>
        <a href="#" className="register-support">
          Support
        </a>
      </header>

      <main className="register-main">
        <article className="register-card">
          <h1>Join DevHub</h1>
          <p>Connect with the world&apos;s best developers.</p>

          <form className="register-form" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="fullName">Full Name</label>
            <div className="input-wrap">
              <span>&#128100;</span>
              <input id="fullName" name="fullName" type="text" placeholder="Linus Torvalds" />
            </div>

            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <span>@</span>
              <input id="username" name="username" type="text" placeholder="linus_t" />
            </div>

            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <span>&#9993;</span>
              <input id="email" name="email" type="email" placeholder="name@company.com" />
            </div>

            <div className="dual-fields">
              <div>
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <span>&#128274;</span>
                  <input id="password" name="password" type="password" placeholder="........" />
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
                  />
                </div>
              </div>
            </div>

            <label className="check-row" htmlFor="terms">
              <input id="terms" name="terms" type="checkbox" />
              <span>I accept the Terms and Privacy Policy.</span>
            </label>

            <button type="submit" className="register-submit">
              Create Account
              <span aria-hidden="true">&#8594;</span>
            </button>
          </form>

          <p className="register-footnote">
            Already have an account? <a href="#">Login</a>
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
