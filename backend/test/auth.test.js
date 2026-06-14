const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/User');

const User = require('../src/models/User');
const app = require('../src/app');

process.env.JWT_SECRET = 'test-secret';

describe('Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 when email missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);
  });

  test('returns 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid-email'
      });

    expect(response.status).toBe(400);
  });

  test('creates new user if not found', async () => {
    User.findOne.mockResolvedValue(null);

    User.create.mockResolvedValue({
      _id: '123',
      email: 'alice@test.com',
      subscriptions: []
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@test.com'
      });

    expect(response.status).toBe(200);

    expect(User.create).toHaveBeenCalled();
    expect(response.body.token).toBeDefined();
  });

  test('returns existing user', async () => {
    User.findOne.mockResolvedValue({
      _id: '123',
      email: 'alice@test.com',
      subscriptions: []
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@test.com'
      });

    expect(response.status).toBe(200);

    expect(User.create).not.toHaveBeenCalled();
  });

  test('rejects invalid token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set(
        'Authorization',
        'Bearer invalid-token'
      );

    expect(response.status).toBe(401);
  });

  test('allows valid token', async () => {
    const token = jwt.sign(
      {
        userId: '123'
      },
      process.env.JWT_SECRET
    );

    User.findById.mockResolvedValue({
      _id: '123',
      email: 'alice@test.com',
      subscriptions: []
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set(
        'Authorization',
        `Bearer ${token}`
      );

    expect(response.status).toBe(200);

    expect(response.body.email).toBe(
      'alice@test.com'
    );
  });
});