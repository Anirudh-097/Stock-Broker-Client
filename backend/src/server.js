require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const connectDB = require('./db');
const setupStockSockets = require('./socket');
const { SUPPORTED_STOCKS } = require('./constants');
const {
  createStockPriceGenerator
} = require('./services/stockPriceGenerator');

const PORT = process.env.PORT || 5000;

const start = async () => {
  if (process.env.MONGO_URI) {
    await connectDB();
  } else {
    console.warn(
      'MONGO_URI is not set; starting without database connection'
    );
  }

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*'
    }
  });
  const priceGenerator = createStockPriceGenerator({
    io,
    stocks: SUPPORTED_STOCKS
  });

  setupStockSockets(io, priceGenerator);
  priceGenerator.start();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
