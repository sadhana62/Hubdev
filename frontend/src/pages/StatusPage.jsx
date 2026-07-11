import { useEffect, useState } from "react";

export default function StatusPage() {
  const [state, setState] = useState({
    loading: true,
    checkedAt: "",
    error: "",
    data: null
  });

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch("/api/health");

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          setState({
            loading: false,
            checkedAt: new Date().toLocaleTimeString(),
            error: "",
            data
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            loading: false,
            checkedAt: new Date().toLocaleTimeString(),
            error: error.message || "Unable to reach the backend.",
            data: null
          });
        }
      }
    }

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Live signal</p>
          <h2>Backend status</h2>
        </div>
        <p className="panel-subtitle">
          This view pulls live data from the Express API so the frontend stays
          tied to the backend rather than a static mock.
        </p>
      </div>

      {state.loading ? <p className="status-note">Checking backend...</p> : null}

      {state.error ? (
        <div className="status-box status-box-error">
          <strong>Connection error</strong>
          <p>{state.error}</p>
        </div>
      ) : null}

      {state.data ? (
        <div className="status-shell">
          <div className="status-box">
            <div className="status-row">
              <span className="status-label">Name</span>
              <strong>{state.data.name}</strong>
            </div>
            <div className="status-row">
              <span className="status-label">Status</span>
              <strong>{state.data.status}</strong>
            </div>
            <div className="status-row">
              <span className="status-label">Port</span>
              <strong>{state.data.port}</strong>
            </div>
            <div className="status-row">
              <span className="status-label">Checked at</span>
              <strong>{state.checkedAt || state.data.timestamp}</strong>
            </div>
          </div>

          <div className="status-box status-box-raw">
            <span className="status-label">Raw payload</span>
            <pre>{JSON.stringify(state.data, null, 2)}</pre>
          </div>
        </div>
      ) : null}
    </section>
  );
}
