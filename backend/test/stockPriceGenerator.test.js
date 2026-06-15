const {
  createRoomName,
  createStockPriceGenerator
} = require('../src/services/stockPriceGenerator');

const createFakeIo = () => {
  const emissions = [];

  return {
    emissions,
    to: jest.fn((room) => ({
      emit: jest.fn((event, payload) => {
        emissions.push({
          room,
          event,
          payload
        });
      })
    }))
  };
};

describe('Stock Price Generator', () => {
  test('creates room names by ticker', () => {
    expect(createRoomName('GOOG'))
      .toBe('stock:GOOG');
  });

  test('emits one update per stock to only that stock room', () => {
    const io = createFakeIo();
    const generator = createStockPriceGenerator({
      io,
      stocks: ['GOOG', 'TSLA'],
      random: jest.fn()
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(0)
    });

    generator.tick();

    expect(io.to).toHaveBeenCalledTimes(2);
    expect(io.to).toHaveBeenNthCalledWith(
      1,
      'stock:GOOG'
    );
    expect(io.to).toHaveBeenNthCalledWith(
      2,
      'stock:TSLA'
    );
    expect(io.emissions).toEqual([
      {
        room: 'stock:GOOG',
        event: 'stock:price',
        payload: expect.objectContaining({
          ticker: 'GOOG',
          previousPrice: 100,
          price: 105,
          change: 5
        })
      },
      {
        room: 'stock:TSLA',
        event: 'stock:price',
        payload: expect.objectContaining({
          ticker: 'TSLA',
          previousPrice: 100,
          price: 95,
          change: -5
        })
      }
    ]);
  });

  test('keeps generated price changes within minus five and plus five', () => {
    const io = createFakeIo();
    const generator = createStockPriceGenerator({
      io,
      stocks: ['GOOG'],
      random: jest.fn()
        .mockReturnValueOnce(0.8)
        .mockReturnValueOnce(0.2)
    });

    generator.tick();
    generator.tick();

    const changes = io.emissions.map(
      ({ payload }) => payload.change
    );

    expect(changes).toEqual([3, -3]);
    changes.forEach((change) => {
      expect(change).toBeGreaterThanOrEqual(-5);
      expect(change).toBeLessThanOrEqual(5);
    });
  });
});
