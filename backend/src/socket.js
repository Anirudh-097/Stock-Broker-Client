const { SUPPORTED_STOCKS } = require('./constants');
const { createRoomName } = require('./services/stockPriceGenerator');

const normalizeTicker = (ticker) => (
  typeof ticker === 'string'
    ? ticker.trim().toUpperCase()
    : ''
);

const setupStockSockets = (io, priceGenerator) => {
  io.on('connection', (socket) => {
    socket.on('stock:join', (ticker, acknowledge) => {
      const normalizedTicker = normalizeTicker(ticker);

      if (!SUPPORTED_STOCKS.includes(normalizedTicker)) {
        if (typeof acknowledge === 'function') {
          acknowledge({
            ok: false,
            message: 'Unsupported stock'
          });
        }

        return;
      }

      const room = createRoomName(normalizedTicker);

      socket.join(room);
      socket.emit('stock:price', {
        ticker: normalizedTicker,
        price: priceGenerator.getPrice(normalizedTicker)
      });

      if (typeof acknowledge === 'function') {
        acknowledge({
          ok: true,
          room
        });
      }
    });

    socket.on('stock:leave', (ticker, acknowledge) => {
      const normalizedTicker = normalizeTicker(ticker);

      if (SUPPORTED_STOCKS.includes(normalizedTicker)) {
        socket.leave(createRoomName(normalizedTicker));
      }

      if (typeof acknowledge === 'function') {
        acknowledge({
          ok: true
        });
      }
    });
  });
};

module.exports = setupStockSockets;
