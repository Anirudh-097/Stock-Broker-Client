const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/User');

const User = require('../src/models/User');
const app = require('../src/app');

process.env.JWT_SECRET = 'test-secret';

describe('Subscriptions', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();

    token = jwt.sign(
      {
        userId: '123'
      },
      process.env.JWT_SECRET
    );
  });

  test(
    'rejects unsupported stock',
    async () => {
      const response =
        await request(app)
          .post('/api/sub')
          .set(
            'Authorization',
            `Bearer ${token}`
          )
          .send({
            ticker: 'AAPL'
          });

      expect(response.status)
        .toBe(400);
    }
  );

  test(
    'subscribes successfully',
    async () => {
      User.findByIdAndUpdate.mockResolvedValue(
        {
          subscriptions: ['GOOG']
        }
      );

      const response =
        await request(app)
          .post('/api/sub')
          .set(
            'Authorization',
            `Bearer ${token}`
          )
          .send({
            ticker: 'GOOG'
          });

      expect(response.status)
        .toBe(200);

      expect(
        response.body.subscriptions
      ).toContain('GOOG');
    }
  );

  test(
    'returns subscriptions',
    async () => {
      User.findById.mockResolvedValue({
        subscriptions: [
          'GOOG',
          'TSLA'
        ]
      });

      const response =
        await request(app)
          .get('/api/sub')
          .set(
            'Authorization',
            `Bearer ${token}`
          );

      expect(response.status)
        .toBe(200);

      expect(
        response.body.subscriptions
      ).toHaveLength(2);
    }
  );
});