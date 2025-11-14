import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url) => {
        if (String(url).includes('/api/health')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              status: 'ok',
              uptime: 42,
              timestamp: '2025-11-10T00:00:00.000Z',
              version: '1.0.0',
              environment: 'test',
              host: { hostname: 'localhost' },
              metrics: [
                {
                  name: 'http_requests_total',
                  values: [{ value: 10 }]
                },
                {
                  name: 'http_request_errors_total',
                  values: [{ value: 1 }]
                }
              ]
            })
          });
        }

        if (String(url).includes('/api/status')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              status: 'ok',
              version: '1.0.0',
              commit: 'abc123',
              releasedAt: '2025-11-10T00:00:00.000Z',
              environment: 'test'
            })
          });
        }

        return Promise.reject(new Error('Unknown endpoint'));
      })
    );
    vi.spyOn(window, 'open').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders health metrics and release metadata', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/deployhub delivery control plane/i)).toBeInTheDocument();
      expect(screen.getByText(/42s/)).toBeInTheDocument();
      expect(screen.getByText(/Requests/i)).toBeInTheDocument();
      expect(screen.getByText(/Release tag/i)).toBeInTheDocument();
    });
  });
});
