const request = require('supertest');
const app = require('../server');
const { Campaign, User, Category, sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('User-Generated Campaigns — End-to-End', () => {
  let adminToken, userToken, user2Token;
  let testCategory, submittedCampaignId, userId1;

  beforeAll(async () => {
    await seedData();

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@donaria.com', password: 'admin123',
    });
    adminToken = adminLogin.body.data.token;

    // Register or login user 1
    let user1Res = await request(app).post('/api/auth/register').send({
      name: 'Test User', email: 'ugc_user1@test.com', password: 'password123', phone: '081111111111',
    });
    if (user1Res.statusCode !== 201) {
      user1Res = await request(app).post('/api/auth/login').send({
        email: 'ugc_user1@test.com', password: 'password123',
      });
    }
    userToken = user1Res.body.data.token;
    userId1 = user1Res.body.data.user.id;

    // Register or login user 2
    let user2Res = await request(app).post('/api/auth/register').send({
      name: 'Test User 2', email: 'ugc_user2@test.com', password: 'password123', phone: '082222222222',
    });
    if (user2Res.statusCode !== 201) {
      user2Res = await request(app).post('/api/auth/login').send({
        email: 'ugc_user2@test.com', password: 'password123',
      });
    }
    user2Token = user2Res.body.data.token;

    testCategory = await Category.findOne();
  });

  // ── USER SUBMIT ──

  describe('POST /api/campaigns/submit', () => {
    it('user can submit a campaign → status pending', async () => {
      const res = await request(app)
        .post('/api/campaigns/submit')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test UGC Submit',
          category_id: testCategory.id,
          target_amount: 5000000,
          short_description: 'Short desc',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.campaign.status).toBe('pending');
      submittedCampaignId = res.body.data.campaign.id;
    });

    it('rejects without title', async () => {
      const res = await request(app)
        .post('/api/campaigns/submit')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ category_id: testCategory.id, target_amount: 5000000 });
      expect(res.statusCode).toEqual(400);
    });

    it('rejects target below 100000', async () => {
      const res = await request(app)
        .post('/api/campaigns/submit')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Test UGC Low', category_id: testCategory.id, target_amount: 50000 });
      expect(res.statusCode).toEqual(400);
    });

    it('rejects unauthenticated', async () => {
      const res = await request(app)
        .post('/api/campaigns/submit')
        .send({ title: 'Test UGC NoAuth', category_id: testCategory.id, target_amount: 5000000 });
      expect(res.statusCode).toEqual(401);
    });
  });

  // ── USER VIEW OWN ──

  describe('GET /api/campaigns/my', () => {
    it('user sees own campaigns', async () => {
      const res = await request(app)
        .get('/api/campaigns/my')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      const found = res.body.data.campaigns.find(c => c.id === submittedCampaignId);
      expect(found).toBeDefined();
      expect(found.status).toBe('pending');
    });

    it('user2 does not see user1 campaigns', async () => {
      const res = await request(app)
        .get('/api/campaigns/my')
        .set('Authorization', `Bearer ${user2Token}`);

      const found = res.body.data.campaigns.find(c => c.id === submittedCampaignId);
      expect(found).toBeUndefined();
    });
  });

  // ── PUBLIC VISIBILITY ──

  describe('GET /api/campaigns (public)', () => {
    it('pending NOT visible by default', async () => {
      const res = await request(app).get('/api/campaigns');
      const found = res.body.data.campaigns.find(c => c.id === submittedCampaignId);
      expect(found).toBeUndefined();
    });

    it('pending visible with status filter', async () => {
      const res = await request(app).get('/api/campaigns?status=pending');
      const found = res.body.data.campaigns.find(c => c.id === submittedCampaignId);
      expect(found).toBeDefined();
    });
  });

  // ── ADMIN APPROVE ──

  describe('PUT /api/campaigns/:id/approve', () => {
    it('admin can approve pending campaign', async () => {
      const res = await request(app)
        .put(`/api/campaigns/${submittedCampaignId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.campaign.status).toBe('active');
    });

    it('now visible publicly', async () => {
      const res = await request(app).get('/api/campaigns');
      const found = res.body.data.campaigns.find(c => c.id === submittedCampaignId);
      expect(found).toBeDefined();
      expect(found.status).toBe('active');
    });

    it('cannot approve non-pending', async () => {
      const res = await request(app)
        .put(`/api/campaigns/${submittedCampaignId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(400);
    });

    it('non-admin cannot approve', async () => {
      const camp = await Campaign.create({
        title: 'Test UGC Guard', category_id: testCategory.id,
        target_amount: 1000000, user_id: userId1, status: 'pending',
      });
      const res = await request(app)
        .put(`/api/campaigns/${camp.id}/approve`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
      await camp.destroy();
    });
  });

  // ── ADMIN REJECT ──

  describe('PUT /api/campaigns/:id/reject', () => {
    let rejectableId;

    beforeAll(async () => {
      const camp = await Campaign.create({
        title: 'Test UGC Reject', category_id: testCategory.id,
        target_amount: 1000000, user_id: userId1, status: 'pending',
      });
      rejectableId = camp.id;
    });

    it('admin can reject pending campaign', async () => {
      const res = await request(app)
        .put(`/api/campaigns/${rejectableId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.campaign.status).toBe('rejected');
    });

    it('cannot reject non-pending', async () => {
      const res = await request(app)
        .put(`/api/campaigns/${rejectableId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(400);
    });
  });

  // ── USER EDIT OWN ──

  describe('PUT /api/campaigns/my/:id', () => {
    let editableId;

    beforeAll(async () => {
      const camp = await Campaign.create({
        title: 'Test UGC Edit', category_id: testCategory.id,
        target_amount: 1000000, user_id: userId1, status: 'pending',
      });
      editableId = camp.id;
    });

    it('user can edit own pending campaign', async () => {
      const res = await request(app)
        .put(`/api/campaigns/my/${editableId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Test UGC Edited', target_amount: 2000000 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.campaign.title).toBe('Test UGC Edited');
    });

    it('user cannot edit active campaign', async () => {
      // Make it active first
      await Campaign.update({ status: 'active' }, { where: { id: editableId } });

      const res = await request(app)
        .put(`/api/campaigns/my/${editableId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Test UGC Fail' });

      expect(res.statusCode).toEqual(400);
    });

    it('user cannot edit other users campaign', async () => {
      const res = await request(app)
        .put(`/api/campaigns/my/${editableId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ title: 'Test UGC Hack' });

      expect(res.statusCode).toEqual(404);
    });
  });

  // ── USER RESUBMIT ──

  describe('POST /api/campaigns/:id/resubmit', () => {
    let rejectedId;

    beforeAll(async () => {
      const camp = await Campaign.create({
        title: 'Test UGC Resubmit', category_id: testCategory.id,
        target_amount: 1000000, user_id: userId1, status: 'rejected',
      });
      rejectedId = camp.id;
    });

    it('user can resubmit rejected campaign', async () => {
      const res = await request(app)
        .post(`/api/campaigns/${rejectedId}/resubmit`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.campaign.status).toBe('pending');
    });

    it('cannot resubmit non-rejected', async () => {
      const res = await request(app)
        .post(`/api/campaigns/${rejectedId}/resubmit`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(400);
    });

    it('user cannot resubmit other users campaign', async () => {
      const camp = await Campaign.create({
        title: 'Test UGC Resubmit Guard', category_id: testCategory.id,
        target_amount: 1000000, user_id: userId1, status: 'rejected',
      });
      const res = await request(app)
        .post(`/api/campaigns/${camp.id}/resubmit`)
        .set('Authorization', `Bearer ${user2Token}`);
      expect(res.statusCode).toEqual(404);
      await camp.destroy();
    });
  });

  // ── ADMIN CREATE (direct active) ──

  describe('POST /api/campaigns (admin)', () => {
    it('admin create → active immediately', async () => {
      const res = await request(app)
        .post('/api/campaigns')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Test UGC AdminDirect', category_id: testCategory.id, target_amount: 10000000 });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.campaign.status).toBe('active');
    });
  });
});
