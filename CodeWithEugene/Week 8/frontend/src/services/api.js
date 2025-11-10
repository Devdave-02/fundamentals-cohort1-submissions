const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }
  return response.json();
};

export const fetchHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/api/health`, {
    headers: {
      Accept: 'application/json'
    }
  });
  return handleResponse(response);
};

export const fetchStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/api/status`, {
    headers: {
      Accept: 'application/json'
    }
  });
  return handleResponse(response);
};

export const getMetricsUrl = () => `${API_BASE_URL}/metrics`;
