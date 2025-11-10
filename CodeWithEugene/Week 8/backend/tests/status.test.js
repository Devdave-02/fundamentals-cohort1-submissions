const request = require('supertest');
const app = require('../src/app');

describe('Status endpoint', () => {
  it('returns deployment metadata', async () => {
    process.env.GIT_SHA = 'test-sha';
    process.env.RELEASED_AT = '2025-11-10T00:00:00.000Z';

    const response = await request(app).get('/api/status');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      commit: 'test-sha',
      releasedAt: '2025-11-10T00:00:00.000Z'
    });
  });

  afterEach(() => {
    delete process.env.GIT_SHA;
    delete process.env.RELEASED_AT;
  });
});
