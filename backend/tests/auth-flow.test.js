const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('Authentication', () => {
  beforeAll(async () => {
    await seedData();
  });

  // ── Register ──

  describe('POST /api/auth/register', () => {
    it('registers a new user', async () => {
      const uniqueEmail = `auth_new_${Date.now()}@test.com`;
      const res = await request(app).post('/api/auth/register').send({
        name: 'Auth Test User', email: uniqueEmail,
        password: 'password123', phone: '083000000001',
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.name).toBe('Auth Test User');
      expect(res.body.data.user.role).toBe('donatur');
    });

    it('rejects duplicate email', async () => {
      // Use the admin email which always exists
      const res = await request(app).post('/api/auth/register').send({
        name: 'Duplicate', email: 'admin@donaria.com',
        password: 'password123', phone: '083000000002',
      });
      expect(res.statusCode).toEqual(400);
    });

    it('rejects invalid email', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Bad Email', email: 'not-an-email',
        password: 'password123', phone: '083000000003',
      });
      expect(res.statusCode).toEqual(400);
    });

    it('rejects short password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Short Pass', email: 'short@test.com',
        password: '123', phone: '083000000004',
      });
      expect(res.statusCode).toEqual(400);
    });
  });

  // ── Login ──

  describe('POST /api/auth/login', () => {
    it('logs in with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@donaria.com', password: 'admin123',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe('admin');
    });

    it('rejects wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@donaria.com', password: 'wrongpass',
      });
      expect(res.statusCode).toEqual(401);
    });

    it('rejects non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nobody@test.com', password: 'password123',
      });
      expect(res.statusCode).toEqual(401);
    });
  });

  // ── Profile ──

  describe('GET /api/auth/me', () => {
    it('returns user profile', async () => {
      const login = await request(app).post('/api/auth/login').send({
        email: 'admin@donaria.com', password: 'admin123',
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${login.body.data.token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('admin@donaria.com');
    });

    it('rejects without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toEqual(401);
    });

    it('rejects invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');
      // May be 401 (invalid token) or 429 (rate limit)
      expect([401, 429]).toContain(res.statusCode);
    });
  });
});
