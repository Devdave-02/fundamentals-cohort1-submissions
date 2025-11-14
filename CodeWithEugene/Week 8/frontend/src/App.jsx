import { useMemo } from 'react';
import MetricTile from './components/MetricTile';
import StatusCard from './components/StatusCard';
import { useHealthStatus } from './hooks/useHealthStatus';
import { getMetricsUrl } from './services/api';

const formatDuration = (seconds = 0) => {
  const sec = Math.floor(seconds % 60);
  const minutes = Math.floor((seconds / 60) % 60);
  const hours = Math.floor((seconds / 3600) % 24);
  const days = Math.floor(seconds / 86400);
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  parts.push(`${sec}s`);
  return parts.join(' ');
};

const calculateCounters = (metrics = []) => {
  const getTotal = (metricName) => {
    const metric = metrics.find((item) => item.name === metricName);
    if (!metric || !metric.values) {
      return 0;
    }
    return metric.values.reduce((accumulator, entry) => accumulator + Number(entry.value || 0), 0);
  };

  return {
    requestsTotal: getTotal('http_requests_total'),
    errorsTotal: getTotal('http_request_errors_total')
  };
};

const App = () => {
  const { health, status, refresh } = useHealthStatus();
  const dashboardUrl = import.meta.env.VITE_OBSERVABILITY_DASHBOARD_URL;

  const counters = useMemo(() => calculateCounters(health.data?.metrics), [health.data]);

  const backendStatus = health.error
    ? 'Error'
    : health.loading
    ? 'Loading'
    : health.data?.status === 'ok'
    ? 'OK'
    : 'Degraded';

  return (
    <>
      <header className="app-header">
        <div>
          <h1>DeployHub Delivery Control Plane</h1>
          <p>Live observability for the automated delivery pipeline.</p>
        </div>
        <button type="button" className="button" onClick={refresh}>
          Refresh Now
        </button>
      </header>

      <main>
        <StatusCard
          title="Backend Health"
          status={backendStatus}
          description="Key signals coming from the Express service."
          actions={[
            {
              label: 'View raw metrics',
              onClick: () => {
                if (typeof window !== 'undefined' && typeof window.open === 'function') {
                  window.open(getMetricsUrl(), '_blank', 'noopener,noreferrer');
                }
              }
            }
          ]}
          footer={<span className="footer-text">Powered by Prometheus + Winston instrumentation.</span>}
        >
          {health.loading ? (
            <div className="loading">Pulling latest health snapshot…</div>
          ) : health.error ? (
            <div className="error">{health.error.message}</div>
          ) : (
            <>
              <dl className="metric-grid">
                <MetricTile label="Uptime" value={formatDuration(health.data?.uptime)} accent="success" />
                <MetricTile
                  label="Requests"
                  value={counters.requestsTotal.toLocaleString()}
                  accent="primary"
                />
                <MetricTile
                  label="Errors"
                  value={counters.errorsTotal.toLocaleString()}
                  accent="danger"
                />
                <MetricTile
                  label="Environment"
                  value={health.data?.environment?.toUpperCase() || 'N/A'}
                  accent="warning"
                />
              </dl>
              <table className="health-table">
                <tbody>
                  <tr>
                    <th scope="row">Version</th>
                    <td>{health.data?.version}</td>
                  </tr>
                  <tr>
                    <th scope="row">Last heartbeat</th>
                    <td>{new Date(health.data?.timestamp).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th scope="row">Host</th>
                    <td>{health.data?.host?.hostname}</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </StatusCard>

        <StatusCard
          title="Release Metadata"
          status={status.loading ? 'Loading' : status.error ? 'Unknown' : 'OK'}
          description="Deployment fingerprints reported by the CI/CD pipeline."
          footer={<span className="footer-text">Keep your Git SHA + released time in sync via CI exports.</span>}
        >
          {status.loading ? (
            <div className="loading">Fetching deployment metadata…</div>
          ) : status.error ? (
            <div className="error">{status.error.message}</div>
          ) : (
            <table className="health-table">
              <tbody>
                <tr>
                  <th scope="row">Release tag</th>
                  <td>{status.data?.version}</td>
                </tr>
                <tr>
                  <th scope="row">Commit</th>
                  <td>{status.data?.commit || '—'}</td>
                </tr>
                <tr>
                  <th scope="row">Released at</th>
                  <td>{status.data?.releasedAt || '—'}</td>
                </tr>
                <tr>
                  <th scope="row">Environment</th>
                  <td>{status.data?.environment}</td>
                </tr>
              </tbody>
            </table>
          )}
        </StatusCard>

        <StatusCard
          title="Observability Toolkit"
          description="Hook these endpoints into Grafana, Alertmanager, Datadog, or the platform of your choice."
          footer={
            <span className="footer-text">
              Configure the dashboard URL via `VITE_OBSERVABILITY_DASHBOARD_URL`.
            </span>
          }
        >
          <ul>
            <li>
              <strong>Prometheus scrape URL:</strong> <code>{getMetricsUrl()}</code>
            </li>
            <li>
              <strong>Log stream:</strong> Check Render/Railway logs for structured Winston output.
            </li>
            <li>
              <strong>Suggested dashboards:</strong> API latency (P95), error rate, deployment frequency.
            </li>
            {dashboardUrl ? (
              <li>
                <strong>Live dashboard:</strong>{' '}
                <a href={dashboardUrl} target="_blank" rel="noreferrer">
                  {dashboardUrl}
                </a>
              </li>
            ) : null}
          </ul>
        </StatusCard>
      </main>
    </>
  );
};

export default App;
