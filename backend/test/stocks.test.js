const request = require('supertest');

const app = require('../src/app');

describe('Stocks API', () => {
  test('returns supported stock metadata', async () => {
    const response = await request(app).get('/api/stocks');

    expect(response.status).toBe(200);
    expect(response.body.stocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ticker: 'GOOG',
          price: 100
        })
      ])
    );
  });
});
