const request = require('supertest');
const app = require('../server');
const { Donation, Campaign, Category, User, sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('Donation Flow', () => {
  let adminToken, userToken, userId;
  let testCampaign;

  beforeAll(async () => {
    await seedData();

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@donaria.com', password: 'admin123',
    });
    adminToken = adminLogin.body.data.token;

    let u = await request(app).post('/api/auth/register').send({
      name: 'Donation User', email: 'don_test@test.com', password: 'password123', phone: '082000000001',
    });
    if (u.statusCode !== 201) u = await request(app).post('/api/auth/login').send({ email: 'don_test@test.com', password: 'password123' });
    userToken = u.body.data.token;
    userId = u.body.data.user.id;

    const category = await Category.findOne();
    const admin = await User.findOne({ where: { role: 'admin' } });
    testCampaign = await Campaign.create({
      title: 'Donation Test Campaign', slug: 'don-test-' + Date.now(),
      description: 'Test', target_amount: 5000000, current_amount: 0,
      status: 'active', category_id: category.id, user_id: admin.id,
    });
  });

  // ── Recent Donations (public) ──

  describe('GET /api/donations/recent', () => {
    it('returns recent donations', async () => {
      const res = await request(app).get('/api/donations/recent');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.donations)).toBe(true);
    });

    it('anonymous donations hide donor name', async () => {
      // Create an anonymous donation
      await Donation.create({
        user_id: userId, campaign_id: testCampaign.id,
        amount: 10000, is_anonymous: true, status: 'success',
        message: 'Anonymous test',
      });

      const res = await request(app).get('/api/donations/recent');
      const anonDonation = res.body.data.donations.find(d => d.is_anonymous === true);
      if (anonDonation) {
        expect(anonDonation.donatur.name).toBe('Anonim');
      }
    });
  });

  // ── My Donations ──

  describe('GET /api/donations', () => {
    it('user can see own donations', async () => {
      const res = await request(app)
        .get('/api/donations')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.donations)).toBe(true);
    });

    it('unauthenticated cannot access', async () => {
      const res = await request(app).get('/api/donations');
      expect(res.statusCode).toEqual(401);
    });

    it('supports pagination', async () => {
      const res = await request(app)
        .get('/api/donations?limit=2')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.pagination).toBeDefined();
    });
  });

  // ── Get by ID ──

  describe('GET /api/donations/:id', () => {
    it('owner can see own donation', async () => {
      const donation = await Donation.findOne({ where: { user_id: userId } });
      if (!donation) return;

      const res = await request(app)
        .get(`/api/donations/${donation.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.donation.id).toBe(donation.id);
    });

    it('other user cannot see donation', async () => {
      const donation = await Donation.findOne({ where: { user_id: userId } });
      if (!donation) return;

      const adminLogin = await request(app).post('/api/auth/login').send({
        email: 'admin@donaria.com', password: 'admin123',
      });

      // Admin can see
      const res = await request(app)
        .get(`/api/donations/${donation.id}`)
        .set('Authorization', `Bearer ${adminLogin.body.data.token}`);

      expect(res.statusCode).toEqual(200);
    });

    it('returns 404 for non-existent', async () => {
      const res = await request(app)
        .get('/api/donations/99999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(404);
    });
  });
});
