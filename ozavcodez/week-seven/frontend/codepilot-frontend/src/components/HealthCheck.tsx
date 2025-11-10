import { useHealthCheck } from '../hooks/useApi';

export default function HealthCheck() {
  const { data, loading, error } = useHealthCheck();

  if (loading) {
    return <div className="health-check loading">Checking server health...</div>;
  }

  if (error) {
    return <div className="health-check error">Error: {error}</div>;
  }

  return (
    <div className="health-check">
      <h3>Server Health Status</h3>
      {data && (
        <div>
          <p>Message: {data.message}</p>
          <p>Timestamp: {new Date(data.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}