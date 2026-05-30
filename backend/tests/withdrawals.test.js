const request = require('supertest');
const app = require('../server');
const { Withdrawal, Campaign, Category, User, sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('Withdrawals', () => {
  let adminToken, userToken;
  let testCampaign;

  beforeAll(async () => {
    await seedData();

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@donaria.com', password: 'admin123',
    });
    adminToken = adminLogin.body.data.token;

    let u = await request(app).post('/api/auth/register').send({
      name: 'Withdraw User', email: 'wd_test@test.com', password: 'password123', phone: '087000000001',
    });
    if (u.statusCode !== 201) u = await request(app).post('/api/auth/login').send({ email: 'wd_test@test.com', password: 'password123' });
    userToken = u.body.data.token;

    const category = await Category.findOne();
    const admin = await User.findOne({ where: { role: 'admin' } });
    testCampaign = await Campaign.create({
      title: 'Withdrawal Test', slug: 'wd-test-' + Date.now(),
      target_amount: 10000000, current_amount: 5000000,
      status: 'active', category_id: category.id, user_id: admin.id,
    });
  });

  describe('POST /api/withdrawals', () => {
    it('admin can create withdrawal', async () => {
      const res = await request(app)
        .post('/api/withdrawals')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          campaign_id: testCampaign.id,
          amount: 1000000,
          bank_name: 'BCA',
          account_number: '1234567890',
          account_holder: 'Test Account',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.withdrawal.status).toBe('pending');
    });

    it('non-admin cannot create', async () => {
      const res = await request(app)
        .post('/api/withdrawals')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          campaign_id: testCampaign.id, amount: 500000,
          bank_name: 'BCA', account_number: '123', account_holder: 'Test',
        });
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/withdrawals', () => {
    it('admin can list withdrawals', async () => {
      const res = await request(app)
        .get('/api/withdrawals')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.withdrawals)).toBe(true);
    });

    it('non-admin cannot list', async () => {
      const res = await request(app)
        .get('/api/withdrawals')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('PUT /api/withdrawals/:id', () => {
    it('admin can approve withdrawal', async () => {
      const wd = await Withdrawal.findOne({ where: { status: 'pending' } });
      if (!wd) return;

      const res = await request(app)
        .put(`/api/withdrawals/${wd.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved', notes: 'Disetujui' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.withdrawal.status).toBe('approved');
    });
  });
});
