import { useCallback, useEffect, useState } from 'react';
import { fetchHealth, fetchStatus } from '../services/api';

const DEFAULT_REFRESH_INTERVAL = Number(import.meta.env.VITE_HEALTH_REFRESH_MS || 30000);

export const useHealthStatus = () => {
  const [health, setHealth] = useState({ data: null, loading: true, error: null });
  const [status, setStatus] = useState({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    setHealth((prev) => ({ ...prev, loading: true, error: null }));
    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [healthResponse, statusResponse] = await Promise.all([
        fetchHealth(),
        fetchStatus()
      ]);

      setHealth({ data: healthResponse, loading: false, error: null });
      setStatus({ data: statusResponse, loading: false, error: null });
    } catch (error) {
      setHealth({ data: null, loading: false, error });
      setStatus({ data: null, loading: false, error });
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, DEFAULT_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  return {
    health,
    status,
    refresh: load
  };
};
