const request = require('supertest');

const app = require('../src/app');

describe('Pages', () => {
  test('renders login page', async () => {
    const response = await request(app).get('/login');

    expect(response.status).toBe(200);
    expect(response.text).toContain('<h1 id="login-title">Sign in</h1>');
    expect(response.text).toContain('/scripts/login.js');
  });

  test('renders stocks page shell', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('<h1>Stocks</h1>');
    expect(response.text).toContain('/scripts/stocks.js');
  });
});
