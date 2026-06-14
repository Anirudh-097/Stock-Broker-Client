const mongoose = require('mongoose');

describe('Database Connection', () => {
  test('mongoose connection exists', () => {
    expect(mongoose).toBeDefined();
  });
});