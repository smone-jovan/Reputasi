const request = require('supertest');
const app = require('../server');
const { Category, sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('Categories', () => {
  let adminToken;

  beforeAll(async () => {
    await seedData();

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@donaria.com', password: 'admin123',
    });
    adminToken = adminLogin.body.data.token;
  });

  describe('GET /api/categories', () => {
    it('returns all categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.categories)).toBe(true);
      expect(res.body.data.categories.length).toBeGreaterThan(0);
    });

    it('each category has name and slug', async () => {
      const res = await request(app).get('/api/categories');
      const cat = res.body.data.categories[0];
      expect(cat).toHaveProperty('name');
      expect(cat).toHaveProperty('slug');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('returns category by id', async () => {
      const cat = await Category.findOne();
      const res = await request(app).get(`/api/categories/${cat.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.category.id).toBe(cat.id);
    });
  });

  describe('POST /api/categories (admin)', () => {
    it('admin can create category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test Category', slug: 'test-cat-' + Date.now() });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
    });

    it('non-admin cannot create', async () => {
      const login = await request(app).post('/api/auth/login').send({
        email: 'admin@donaria.com', password: 'admin123',
      });

      // Use a regular user token
      let u = await request(app).post('/api/auth/register').send({
        name: 'Cat User', email: 'cat_test@test.com', password: 'password123', phone: '086000000001',
      });
      if (u.statusCode !== 201) u = await request(app).post('/api/auth/login').send({ email: 'cat_test@test.com', password: 'password123' });

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${u.body.data.token}`)
        .send({ name: 'Fail', slug: 'fail' });

      expect(res.statusCode).toEqual(403);
    });
  });
});
