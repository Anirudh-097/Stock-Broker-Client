const request = require('supertest');

const app = require('../src/app');

describe('Stock Page', () => {
  test('renders mock stock dashboard', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('<h1>Stocks</h1>');
    expect(response.text).toContain('GOOG');
    expect(response.text).toContain('/scripts/stocks.js');
  });
});
