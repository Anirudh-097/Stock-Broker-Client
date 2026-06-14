const request = require('supertest');
const app = require('../src/app');

describe('Health Endpoint', () => {
  test('returns 200', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
  });

  test('returns expected payload', async () => {
    const response = await request(app).get('/health');

    expect(response.body).toEqual({
      status: 'ok'
    });
  });
});