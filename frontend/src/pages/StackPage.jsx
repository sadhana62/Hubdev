const items = [
  "Node.js server entry with nodemon for local backend development",
  "Express application exported from src/app.js",
  "Vite for frontend bundling and fast reloads",
  "React Router for route-driven console views",
  "Health endpoint exposed for UI-to-API connectivity"
];

export default function StackPage() {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">System map</p>
          <h2>Stack layers</h2>
        </div>
        <p className="panel-subtitle">
          The repo is split into a backend service and a frontend control layer
          so each side can evolve independently.
        </p>
      </div>

      <ul className="feature-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="stack-grid">
        <article className="stack-card">
          <span>backend/server.js</span>
          <strong>Boots the Express process on port 5000.</strong>
        </article>
        <article className="stack-card">
          <span>backend/src/app.js</span>
          <strong>Defines the root route and health response.</strong>
        </article>
        <article className="stack-card">
          <span>frontend/vite.config.js</span>
          <strong>Proxies /api to the backend during development.</strong>
        </article>
      </div>
    </section>
  );
}
