const request = require('supertest');
const app = require('../server');
const { Campaign, Category, User, sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('Campaign CRUD (Admin)', () => {
  let adminToken, userToken;
  let testCategory;

  beforeAll(async () => {
    await seedData();

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@donaria.com', password: 'admin123',
    });
    adminToken = adminLogin.body.data.token;

    let u = await request(app).post('/api/auth/register').send({
      name: 'Campaign User', email: 'camp_test@test.com', password: 'password123', phone: '084000000001',
    });
    if (u.statusCode !== 201) u = await request(app).post('/api/auth/login').send({ email: 'camp_test@test.com', password: 'password123' });
    userToken = u.body.data.token;

    testCategory = await Category.findOne();
  });

  // ── List Campaigns (public) ──

  describe('GET /api/campaigns', () => {
    it('returns campaigns list', async () => {
      const res = await request(app).get('/api/campaigns');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.campaigns)).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
    });

    it('supports category filter', async () => {
      const res = await request(app).get(`/api/campaigns?category=${testCategory.id}`);
      expect(res.statusCode).toEqual(200);
    });

    it('supports search', async () => {
      const res = await request(app).get('/api/campaigns?search=test');
      expect(res.statusCode).toEqual(200);
    });

    it('hides pending campaigns by default', async () => {
      const res = await request(app).get('/api/campaigns');
      const pending = res.body.data.campaigns.filter(c => c.status === 'pending');
      expect(pending.length).toBe(0);
    });
  });

  // ── Get by ID (public) ──

  describe('GET /api/campaigns/:id', () => {
    it('returns campaign detail', async () => {
      const campaign = await Campaign.findOne();
      const res = await request(app).get(`/api/campaigns/${campaign.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.campaign.id).toBe(campaign.id);
      expect(res.body.data.donorCount).toBeDefined();
    });

    it('returns 404 for non-existent', async () => {
      const res = await request(app).get('/api/campaigns/99999');
      expect(res.statusCode).toEqual(404);
    });
  });

  // ── Get Donors (public) ──

  describe('GET /api/campaigns/:id/donors', () => {
    it('returns donors list', async () => {
      const campaign = await Campaign.findOne();
      const res = await request(app).get(`/api/campaigns/${campaign.id}/donors`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data.donations)).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
    });
  });

  // ── Create (admin) ──

  describe('POST /api/campaigns', () => {
    it('admin can create campaign', async () => {
      const res = await request(app)
        .post('/api/campaigns')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Admin Created Campaign', category_id: testCategory.id,
          target_amount: 10000000, description: 'Test description',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.campaign.status).toBe('active');
    });

    it('non-admin cannot create', async () => {
      const res = await request(app)
        .post('/api/campaigns')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Fail', category_id: testCategory.id, target_amount: 1000000 });
      expect(res.statusCode).toEqual(403);
    });
  });

  // ── Update (admin) ──

  describe('PUT /api/campaigns/:id', () => {
    it('admin can update campaign', async () => {
      const campaign = await Campaign.findOne();
      const res = await request(app)
        .put(`/api/campaigns/${campaign.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.campaign.title).toBe('Updated Title');
    });
  });

  // ── Delete (admin, soft) ──

  describe('DELETE /api/campaigns/:id', () => {
    it('admin can soft-delete campaign', async () => {
      const campaign = await Campaign.create({
        title: 'To Delete', slug: 'to-delete-' + Date.now(),
        target_amount: 1000000, category_id: testCategory.id,
        user_id: 1, status: 'active',
      });

      const res = await request(app)
        .delete(`/api/campaigns/${campaign.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);

      const updated = await Campaign.findByPk(campaign.id);
      expect(updated.status).toBe('cancelled');
    });
  });
});
