import  { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState<any>(null);
  const [error, setError] = useState(null);
  const [lastDuration, setLastDuration] = useState<number | null>(null);

  const backendBase =
    import.meta.env.VITE_BACKEND_BASE || "http://localhost:3000";

  async function fetchHealth() {
    try {
      const start = Date.now();
      const res = await fetch(`${backendBase}/api/health`);
      const duration = Date.now() - start;
      setLastDuration(duration);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setHealth({ ...data, responseTimeMs: duration });
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, 20000); // poll every 20s
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>DeployHub — Status Dashboard</h1>
      {error ? <div role="alert">Error: {String(error)}</div> : null}
      {health ? (
        <div>
          <p>
            Status: <strong>{health.status}</strong>
          </p>
          <p>
            Uptime: <strong>{health.uptime}</strong>
          </p>
          <p>Server time: {health.timestamp}</p>

          <p>Last response time: {health.responseTimeMs ?? lastDuration} ms</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
