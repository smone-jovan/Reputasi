const request = require('supertest');
const app = require('../server');
const { Squad, SquadMember, Campaign, Category, User, sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('Squad Donasi', () => {
  let adminToken, user1Token, user2Token, userId1, userId2;
  let testCampaign, testCategory;

  beforeAll(async () => {
    await seedData();

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@donaria.com', password: 'admin123',
    });
    adminToken = adminLogin.body.data.token;

    let u1 = await request(app).post('/api/auth/register').send({
      name: 'Squad User 1', email: 'squad_u1@test.com', password: 'password123', phone: '081000000001',
    });
    if (u1.statusCode !== 201) u1 = await request(app).post('/api/auth/login').send({ email: 'squad_u1@test.com', password: 'password123' });
    user1Token = u1.body.data.token;
    userId1 = u1.body.data.user.id;

    let u2 = await request(app).post('/api/auth/register').send({
      name: 'Squad User 2', email: 'squad_u2@test.com', password: 'password123', phone: '081000000002',
    });
    if (u2.statusCode !== 201) u2 = await request(app).post('/api/auth/login').send({ email: 'squad_u2@test.com', password: 'password123' });
    user2Token = u2.body.data.token;
    userId2 = u2.body.data.user.id;

    testCategory = await Category.findOne();
    const admin = await User.findOne({ where: { role: 'admin' } });
    testCampaign = await Campaign.create({
      title: 'Squad Test Campaign', slug: 'squad-test-' + Date.now(),
      description: 'Test', target_amount: 10000000, current_amount: 0,
      status: 'active', category_id: testCategory.id, user_id: admin.id,
    });
  });

  // ── Create Squad ──

  describe('POST /api/squads', () => {
    it('user can create a squad', async () => {
      const res = await request(app)
        .post('/api/squads')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ name: 'Test Squad 1', campaign_id: testCampaign.id, target_amount: 5000000 });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.squad.name).toBe('Test Squad 1');
      expect(res.body.data.squad.invite_code).toBeDefined();
      expect(res.body.data.squad.status).toBe('active');
    });

    it('unauthenticated cannot create', async () => {
      const res = await request(app)
        .post('/api/squads')
        .send({ name: 'No Auth', campaign_id: testCampaign.id });
      expect(res.statusCode).toEqual(401);
    });
  });

  // ── Get by Code ──

  describe('GET /api/squads/code/:code', () => {
    let inviteCode;

    beforeAll(async () => {
      const squad = await Squad.findOne({ where: { creator_id: userId1 } });
      inviteCode = squad.invite_code;
    });

    it('anyone can get squad by invite code', async () => {
      const res = await request(app).get(`/api/squads/code/${inviteCode}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.squad.invite_code).toBe(inviteCode);
    });

    it('returns 404 for invalid code', async () => {
      const res = await request(app).get('/api/squads/code/INVALID999');
      expect(res.statusCode).toEqual(404);
    });
  });

  // ── Join Squad ──

  describe('POST /api/squads/code/:code/join', () => {
    let freshInviteCode;

    beforeAll(async () => {
      // Create a fresh squad specifically for join tests
      const freshSquad = await request(app)
        .post('/api/squads')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ name: 'Join Test Squad', campaign_id: testCampaign.id, target_amount: 1000000 });
      freshInviteCode = freshSquad.body.data.squad.invite_code;
    });

    it('user can join squad', async () => {
      const res = await request(app)
        .post(`/api/squads/code/${freshInviteCode}/join`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });

    it('cannot join twice', async () => {
      const res = await request(app)
        .post(`/api/squads/code/${freshInviteCode}/join`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.statusCode).toEqual(400);
    });

    it('unauthenticated cannot join', async () => {
      const res = await request(app).post(`/api/squads/code/${freshInviteCode}/join`);
      expect(res.statusCode).toEqual(401);
    });
  });

  // ── Get by Campaign ──

  describe('GET /api/squads/campaign/:id', () => {
    it('returns squads for a campaign', async () => {
      const res = await request(app).get(`/api/squads/campaign/${testCampaign.id}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data.squads)).toBe(true);
      expect(res.body.data.squads.length).toBeGreaterThan(0);
    });
  });

  // ── My Squads ──

  describe('GET /api/squads/my', () => {
    it('user can see own squads', async () => {
      const res = await request(app)
        .get('/api/squads/my')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.squads.length).toBeGreaterThan(0);
    });

    it('unauthenticated cannot access', async () => {
      const res = await request(app).get('/api/squads/my');
      expect(res.statusCode).toEqual(401);
    });
  });

  // ── Get by ID ──

  describe('GET /api/squads/:id', () => {
    it('returns squad detail', async () => {
      const squad = await Squad.findOne({ where: { creator_id: userId1 } });
      const res = await request(app).get(`/api/squads/${squad.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.squad.id).toBe(squad.id);
    });
  });
});
