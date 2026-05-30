const request = require('supertest');
const app = require('../server');
const { Notification, sequelize } = require('../src/models');
const seedData = require('../src/seed');

describe('Notifications', () => {
  let userToken;

  beforeAll(async () => {
    await seedData();

    let u = await request(app).post('/api/auth/register').send({
      name: 'Notif User', email: 'notif_test@test.com', password: 'password123', phone: '085000000001',
    });
    if (u.statusCode !== 201) u = await request(app).post('/api/auth/login').send({ email: 'notif_test@test.com', password: 'password123' });
    userToken = u.body.data.token;
  });

  describe('GET /api/notifications', () => {
    it('returns notifications list', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.notifications)).toBe(true);
      expect(res.body.data.unreadCount).toBeDefined();
    });

    it('unauthenticated cannot access', async () => {
      const res = await request(app).get('/api/notifications');
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('PUT /api/notifications/read-all', () => {
    it('marks all as read', async () => {
      const res = await request(app)
        .put('/api/notifications/read-all')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });
});
