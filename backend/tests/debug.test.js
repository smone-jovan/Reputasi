const request = require('supertest');
const app = require('../server');
const { sequelize, User, Category, Campaign, Setting } = require('../src/models');
const seedData = require('../src/seed');

describe('Debug Donation', () => {
  let token;
  let campaignId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await seedData();
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Tester', email: 'test@test.com', password: 'password123', phone: '081234567890'
    });
    token = reg.body.data.token;
    const cat = await Category.findOne();
    const admin = await User.findOne({where:{role:'admin'}});
    const camp = await Campaign.create({
      title: 'T', slug: 't', target_amount: 1000, current_amount: 0,
      deadline: new Date(), status: 'active', category_id: cat.id, user_id: admin.id
    });
    campaignId = camp.id;
    await Setting.setValue('payment_bypass_mode', true, 'boolean');
  });

  afterAll(async () => { await sequelize.close(); });

  it('debug 500 error', async () => {
    const res = await request(app)
      .post('/api/donations')
      .set('Authorization', `Bearer ${token}`)
      .send({ campaign_id: campaignId, amount: 20000, payment_method: 'qris' });

    console.log('STATUS:', res.statusCode);
    console.log('BODY:', JSON.stringify(res.body, null, 2));
    expect(res.statusCode).toBe(201);
  });
});
