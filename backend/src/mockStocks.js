const { SUPPORTED_STOCKS } = require('./constants');

const STOCK_PROFILES = {
  GOOG: {
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    price: 100
  },
  TSLA: {
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    price: 100
  },
  AMZN: {
    name: 'Amazon.com, Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    price: 100
  },
  META: {
    name: 'Meta Platforms, Inc.',
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    price: 100
  },
  NVDA: {
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    price: 100
  }
};

const mockStocks = SUPPORTED_STOCKS.map((ticker) => ({
  ticker,
  ...STOCK_PROFILES[ticker]
}));

module.exports = mockStocks;
