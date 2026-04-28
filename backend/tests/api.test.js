const request = require('supertest');
const app = require('../server');

describe('API Health Check & Stats', () => {
  it('GET /api/health should return OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.message).toContain('Donaria API is running');
  });

  it('GET /api/stats should return dashboard stats', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalCampaigns');
    expect(res.body.data).toHaveProperty('totalDonations');
    expect(res.body.data).toHaveProperty('totalDonors');
  });
});
