const DEFAULT_INITIAL_PRICE = 100;
const DEFAULT_INTERVAL_MS = 1000;
const DEFAULT_MAX_DELTA = 5;

const roundPrice = (value) => Math.round(value * 100) / 100;

const createRoomName = (ticker) => `stock:${ticker}`;

const createStockPriceGenerator = ({
  io,
  stocks,
  intervalMs = DEFAULT_INTERVAL_MS,
  initialPrice = DEFAULT_INITIAL_PRICE,
  maxDelta = DEFAULT_MAX_DELTA,
  random = Math.random
}) => {
  if (!io || typeof io.to !== 'function') {
    throw new Error('Socket server is required');
  }

  if (!Array.isArray(stocks) || stocks.length === 0) {
    throw new Error('At least one stock is required');
  }

  const prices = new Map(
    stocks.map((ticker) => [
      ticker,
      roundPrice(initialPrice)
    ])
  );

  let timer = null;

  const generateDelta = () => (
    roundPrice((random() * 2 - 1) * maxDelta)
  );

  const tick = () => {
    const timestamp = new Date().toISOString();

    stocks.forEach((ticker) => {
      const previousPrice = prices.get(ticker);
      const change = generateDelta();
      const price = roundPrice(
        Math.max(0.01, previousPrice + change)
      );

      prices.set(ticker, price);

      io.to(createRoomName(ticker)).emit(
        'stock:price',
        {
          ticker,
          price,
          previousPrice,
          change: roundPrice(price - previousPrice),
          timestamp
        }
      );
    });
  };

  const start = () => {
    if (timer) {
      return;
    }

    timer = setInterval(tick, intervalMs);

    if (typeof timer.unref === 'function') {
      timer.unref();
    }
  };

  const stop = () => {
    if (!timer) {
      return;
    }

    clearInterval(timer);
    timer = null;
  };

  const getPrice = (ticker) => prices.get(ticker);

  return {
    getPrice,
    start,
    stop,
    tick
  };
};

module.exports = {
  createRoomName,
  createStockPriceGenerator
};
