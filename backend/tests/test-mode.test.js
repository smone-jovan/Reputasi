const request = require('supertest');
const app = require('../server');
const { Setting, User, Campaign, Category, Donation, Transaction, sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('Test Mode Feature', () => {
  let adminToken;
  let userToken;
  let testCampaign;

  beforeAll(async () => {
    // Tables already created via setup-test-db.sql
    await seedData();

    // Get admin token
    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@donaria.com',
      password: 'admin123',
    });
    adminToken = adminLogin.body.data.token;

    // Register a regular user (or login if exists)
    try {
      const userReg = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'usertest@donaria.com',
        password: 'password123',
        phone: '081234567890',
      });
      userToken = userReg.body.data.token;
    } catch (e) {
      const userLogin = await request(app).post('/api/auth/login').send({
        email: 'usertest@donaria.com',
        password: 'password123',
      });
      userToken = userLogin.body.data.token;
    }

    // Create a test campaign
    const category = await Category.findOne();
    const admin = await User.findOne({ where: { role: 'admin' } });
    testCampaign = await Campaign.create({
      title: 'Test Mode Campaign',
      slug: 'test-mode-campaign-' + Date.now(),
      description: 'Campaign for testing test mode',
      target_amount: 1000000,
      current_amount: 0,
      deadline: new Date(Date.now() + 86400000),
      status: 'active',
      category_id: category.id,
      user_id: admin.id,
    });
  });

  afterAll(async () => {
    // Clean up test campaign
    if (testCampaign) {
      await Campaign.destroy({ where: { id: testCampaign.id } }).catch(() => {});
    }
  });

  // ── Admin Toggle Endpoint ──

  describe('POST /api/admin/test-mode', () => {
    it('admin can toggle test mode ON', async () => {
      // Ensure test mode is OFF first
      await Setting.setValue('test_mode', false, 'boolean');

      const res = await request(app)
        .post('/api/admin/test-mode')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.enabled).toBe(true);
      expect(res.body.message).toContain('Test Mode diaktifkan');

      // Verify setting persisted
      const settingValue = await Setting.getValue('test_mode', false);
      expect(settingValue).toBe(true);
    });

    it('admin can toggle test mode OFF', async () => {
      // First ensure it's ON
      await Setting.setValue('test_mode', true, 'boolean');

      const res = await request(app)
        .post('/api/admin/test-mode')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.enabled).toBe(false);
      expect(res.body.message).toContain('Test Mode dinonaktifkan');
    });

    it('non-admin cannot toggle test mode', async () => {
      const res = await request(app)
        .post('/api/admin/test-mode')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
    });

    it('unauthenticated user cannot toggle test mode', async () => {
      const res = await request(app)
        .post('/api/admin/test-mode');

      expect(res.statusCode).toEqual(401);
    });
  });

  // ── Admin Get Status ──

  describe('GET /api/admin/test-mode', () => {
    it('admin can get test mode status', async () => {
      await Setting.setValue('test_mode', true, 'boolean');

      const res = await request(app)
        .get('/api/admin/test-mode')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.enabled).toBe(true);
    });

    it('non-admin cannot get test mode status via admin endpoint', async () => {
      const res = await request(app)
        .get('/api/admin/test-mode')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });

  // ── Public Test Mode Status ──

  describe('GET /api/settings/test-mode', () => {
    it('public endpoint returns test mode status', async () => {
      await Setting.setValue('test_mode', false, 'boolean');

      const res = await request(app)
        .get('/api/settings/test-mode');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.enabled).toBe(false);
    });

    it('public endpoint returns true when test mode is active', async () => {
      await Setting.setValue('test_mode', true, 'boolean');

      const res = await request(app)
        .get('/api/settings/test-mode');

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.enabled).toBe(true);
    });
  });

  // ── Donation Behavior with Test Mode ──

  describe('POST /api/donations with test mode', () => {
    it('donation settles immediately when test mode is ON', async () => {
      // Arrange: enable test mode
      await Setting.setValue('test_mode', true, 'boolean');
      const initialAmount = Number(testCampaign.current_amount);

      // Act: create donation
      const res = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          campaign_id: testCampaign.id,
          amount: 50000,
          message: 'Test mode donation',
          payment_method: 'qris',
        });

      // Assert: donation is successful
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.donation.status).toBe('success');
      expect(res.body.data.transaction.payment_method).toBe('qris');
      expect(res.body.data.gatewayData.bypass).toBe(true);
      expect(res.body.data.gatewayData.test_mode).toBe(true);

      // Assert: campaign amount incremented
      await testCampaign.reload();
      expect(Number(testCampaign.current_amount)).toBe(initialAmount + 50000);
    });

    it('donation order ID starts with TEST- when test mode is ON', async () => {
      await Setting.setValue('test_mode', true, 'boolean');

      const res = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          campaign_id: testCampaign.id,
          amount: 25000,
          payment_method: 'qris',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.transaction.order_id).toMatch(/^TEST-/);
    });

    it('donation goes through Tripay when test mode is OFF', async () => {
      // Arrange: disable test mode
      await Setting.setValue('test_mode', false, 'boolean');

      // Act: create donation (will fail at Tripay since no real API key)
      const res = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          campaign_id: testCampaign.id,
          amount: 50000,
          payment_method: 'qris',
        });

      // Assert: should fail because Tripay is not configured
      // The key point: it should NOT be a bypass transaction
      if (res.statusCode === 201) {
        expect(res.body.data.gatewayData?.bypass).toBeUndefined();
      } else {
        // Expected: Tripay API error
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
      }
    });

    it('test mode donation creates notification for donor', async () => {
      await Setting.setValue('test_mode', true, 'boolean');

      await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          campaign_id: testCampaign.id,
          amount: 30000,
          payment_method: 'qris',
        });

      // Check notifications
      const notifRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${userToken}`);

      expect(notifRes.statusCode).toEqual(200);
      const testNotif = notifRes.body.data.notifications.find(
        (n) => n.title && n.title.includes('Test')
      );
      expect(testNotif).toBeDefined();
    });

    it('test mode enforces minimum donation amount', async () => {
      await Setting.setValue('test_mode', true, 'boolean');

      const res = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          campaign_id: testCampaign.id,
          amount: 5000, // Below minimum
          payment_method: 'qris',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Minimal donasi');
    });

    it('test mode rejects inactive campaign', async () => {
      await Setting.setValue('test_mode', true, 'boolean');

      // Create an inactive campaign
      const category = await Category.findOne();
      const admin = await User.findOne({ where: { role: 'admin' } });
      const inactiveCampaign = await Campaign.create({
        title: 'Inactive Campaign ' + Date.now(),
        slug: 'inactive-campaign-' + Date.now(),
        description: 'This campaign is cancelled',
        target_amount: 500000,
        current_amount: 0,
        status: 'cancelled',
        category_id: category.id,
        user_id: admin.id,
      });

      const res = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          campaign_id: inactiveCampaign.id,
          amount: 50000,
          payment_method: 'qris',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('tidak tersedia');

      // Clean up
      await Campaign.destroy({ where: { id: inactiveCampaign.id } }).catch(() => {});
    });
  });
});
