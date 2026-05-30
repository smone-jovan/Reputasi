const request = require('supertest');
const app = require('../server');
const { Donation, Campaign, User, Category, Transaction, sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('Admin Analytics Endpoints', () => {
  let adminToken, userToken;

  beforeAll(async () => {
    await seedData();

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@donaria.com', password: 'admin123',
    });
    adminToken = adminLogin.body.data.token;

    let userRes = await request(app).post('/api/auth/register').send({
      name: 'Analytics User', email: 'analytics_test@test.com', password: 'password123', phone: '089999999999',
    });
    if (userRes.statusCode !== 201) {
      userRes = await request(app).post('/api/auth/login').send({
        email: 'analytics_test@test.com', password: 'password123',
      });
    }
    userToken = userRes.body.data.token;
  });

  // ── Trend ──

  describe('GET /api/admin/analytics/trend', () => {
    it('returns array of daily donation totals', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/trend')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.trend).toBeDefined();
      expect(Array.isArray(res.body.data.trend)).toBe(true);
    });

    it('each entry has date, total, count', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/trend')
        .set('Authorization', `Bearer ${adminToken}`);

      const trend = res.body.data.trend;
      expect(trend.length).toBeGreaterThan(0);
      expect(trend[0]).toHaveProperty('date');
      expect(trend[0]).toHaveProperty('total');
      expect(trend[0]).toHaveProperty('count');
    });

    it('fills missing days with zero', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/trend?days=7')
        .set('Authorization', `Bearer ${adminToken}`);

      const trend = res.body.data.trend;
      expect(trend.length).toBe(7);
      // All entries should have numeric total
      trend.forEach(d => {
        expect(typeof d.total).toBe('number');
        expect(typeof d.count).toBe('number');
      });
    });

    it('non-admin cannot access', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/trend')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
    });

    it('unauthenticated cannot access', async () => {
      const res = await request(app).get('/api/admin/analytics/trend');
      expect(res.statusCode).toEqual(401);
    });
  });

  // ── Top Campaigns ──

  describe('GET /api/admin/analytics/top-campaigns', () => {
    it('returns array of campaigns with progress', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/top-campaigns')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.campaigns)).toBe(true);
    });

    it('each campaign has required fields', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/top-campaigns')
        .set('Authorization', `Bearer ${adminToken}`);

      const campaigns = res.body.data.campaigns;
      if (campaigns.length > 0) {
        const c = campaigns[0];
        expect(c).toHaveProperty('id');
        expect(c).toHaveProperty('title');
        expect(c).toHaveProperty('target_amount');
        expect(c).toHaveProperty('current_amount');
        expect(c).toHaveProperty('progress');
        expect(c).toHaveProperty('status');
        expect(typeof c.progress).toBe('number');
        expect(c.progress).toBeGreaterThanOrEqual(0);
        expect(c.progress).toBeLessThanOrEqual(100);
      }
    });

    it('respects limit parameter', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/top-campaigns?limit=3')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.body.data.campaigns.length).toBeLessThanOrEqual(3);
    });

    it('non-admin cannot access', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/top-campaigns')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });

  // ── Top Donors ──

  describe('GET /api/admin/analytics/top-donors', () => {
    it('returns array of donors', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/top-donors')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.donors)).toBe(true);
    });

    it('each donor has required fields', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/top-donors')
        .set('Authorization', `Bearer ${adminToken}`);

      const donors = res.body.data.donors;
      if (donors.length > 0) {
        const d = donors[0];
        expect(d).toHaveProperty('user_id');
        expect(d).toHaveProperty('name');
        expect(d).toHaveProperty('total_amount');
        expect(d).toHaveProperty('donation_count');
        expect(typeof d.total_amount).toBe('number');
        expect(typeof d.donation_count).toBe('number');
      }
    });

    it('respects limit parameter', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/top-donors?limit=2')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.body.data.donors.length).toBeLessThanOrEqual(2);
    });

    it('non-admin cannot access', async () => {
      const res = await request(app)
        .get('/api/admin/analytics/top-donors')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });
});
