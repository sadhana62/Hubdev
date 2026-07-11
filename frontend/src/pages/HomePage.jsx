export default function HomePage() {
  return (
    <section className="home-page">
      <div className="hero-card">
        <div className="hero-grid">
          <div>
            <span className="version-pill">V2.0 BETA NOW LIVE</span>
            <h1 className="home-hero-title">Where Code Finds Its Community</h1>
            <p className="home-hero-copy">
              The ultimate developer ecosystem for sharing open-source projects,
              writing technical insights, and building a professional portfolio
              that speaks for itself.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-solid" type="button">
                Get Started
              </button>
              <button className="btn btn-outline" type="button">
                Explore Projects
              </button>
            </div>
          </div>

          <div className="code-visual" aria-hidden="true">
            <div className="code-window code-window-top">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="code-window code-window-mid">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="code-window code-window-low">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="status-chip">system.status: "building_community"</div>
          </div>
        </div>

        <div className="stats-row">
          <article>
            <strong>50k+</strong>
            <span>DEVELOPERS</span>
          </article>
          <article>
            <strong>1M+</strong>
            <span>POSTS</span>
          </article>
          <article>
            <strong>200k+</strong>
            <span>PROJECTS</span>
          </article>
        </div>
      </div>

      <section className="feature-section">
        <h2>Engineered for the Modern Dev</h2>
        <p>
          Everything you need to showcase your craft and connect with technical
          leaders across the globe.
        </p>

        <div className="mosaic-grid">
          <article className="mosaic-card mosaic-card-wide">
            <p className="card-icon">↗</p>
            <h3>Share Projects</h3>
            <p>
              Deploy your repositories directly into the DevHub ecosystem with
              seamless GitHub integration.
            </p>
          </article>

          <article className="mosaic-card mosaic-card-accent">
            <h3>Trending Tech</h3>
            <div className="tag-row">
              <span>React</span>
              <span>Rust</span>
              <span>Go</span>
              <span>AI</span>
              <span>TypeScript</span>
            </div>
            <small>Updated 5m ago</small>
          </article>

          <article className="mosaic-card">
            <p className="card-icon">▣</p>
            <h3>Developer Posts</h3>
            <p>
              Write long-form technical blogs or quick snippets of practical
              wisdom.
            </p>
          </article>

          <article className="mosaic-card">
            <p className="card-icon">◎</p>
            <h3>Build Portfolio</h3>
            <p>
              Your DevHub profile is your new CV, synced from your latest
              projects and updates.
            </p>
          </article>

          <article className="mosaic-card">
            <p className="card-icon">⋯</p>
            <h3>Connect</h3>
            <p>
              Find co-founders, collaborators, and mentors in focused technical
              stacks.
            </p>
          </article>
        </div>
      </section>

      <section className="cta-strip">
        <h2>Ready to build the future?</h2>
        <p>
          Join the fastest-growing network of engineers and start contributing
          to projects that matter.
        </p>
        <button className="btn btn-solid" type="button">
          Join DevHub Now
        </button>
      </section>

      <footer className="home-footer">
        <div>
          <strong>DevHub</strong>
          <p>© 2024 DevHub Inc. Built for developers by developers.</p>
        </div>

        <nav aria-label="Footer links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">API</a>
          <a href="#">Status</a>
          <a href="#">GitHub</a>
        </nav>
      </footer>
    </section>
  );
}
