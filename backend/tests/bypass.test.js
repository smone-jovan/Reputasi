const request = require('supertest');
const app = require('../server');
const { Setting, User, Campaign, Category, sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('Payment Bypass Integration', () => {
  let adminToken;
  let userToken;
  let testCampaign;

  beforeAll(async () => {
    // Sync and seed test database
    await sequelize.sync({ force: true });
    await seedData();

    // 1. Get Admin Token
    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@donaria.com',
      password: 'admin123'
    });
    adminToken = adminLogin.body.data.token;

    // 2. Register and Get User Token
    const userReg = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      phone: '0812345678'
    });
    userToken = userReg.body.data.token;

    // 3. Create a test campaign
    const category = await Category.findOne();
    const admin = await User.findOne({ where: { role: 'admin' } });

    testCampaign = await Campaign.create({
      title: 'TDD Test Campaign',
      slug: 'tdd-test-campaign',
      description: 'Test description',
      target_amount: 1000000,
      current_amount: 0,
      deadline: new Date(Date.now() + 86400000),
      status: 'active',
      category_id: category.id,
      user_id: admin.id
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('Admin should be able to toggle bypass mode', async () => {
    // Toggle ON
    const resOn = await request(app)
      .post('/api/admin/toggle-bypass')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ enabled: true });

    expect(resOn.statusCode).toEqual(200);
    expect(resOn.body.enabled).toBe(true);

    const statsOn = await request(app).get('/api/stats');
    expect(statsOn.body.data.paymentBypassMode).toBe(true);
  });

  it('Non-admin should NOT be able to toggle bypass mode', async () => {
    const res = await request(app)
      .post('/api/admin/toggle-bypass')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ enabled: true });

    // Expecting 403 or similar if RBAC is active
    // If it fails with 200, we found a security bug!
    expect(res.statusCode).toBe(403);
  });

  it('User donation should settle immediately when bypass is ON', async () => {
    // 1. Enable bypass
    await Setting.setValue('payment_bypass_mode', true, 'boolean');

    // 2. Donate
    const amount = 50000;
    const initialAmount = testCampaign.current_amount;

    const donationRes = await request(app)
      .post('/api/donations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        campaign_id: testCampaign.id,
        amount: amount,
        payment_method: 'qris',
        message: 'TDD Test'
      });

    expect(donationRes.statusCode).toEqual(201);
    expect(donationRes.body.data.donation.status).toBe('success');
    expect(donationRes.body.data.transaction.instructions[0].title).toBe('Mode Testing Aktif');

    // 3. Verify campaign increment
    const campaignUpdated = await request(app).get(`/api/campaigns/${testCampaign.id}`);
    expect(campaignUpdated.body.data.campaign.current_amount).toBe(Number(initialAmount) + amount);
  });
});
