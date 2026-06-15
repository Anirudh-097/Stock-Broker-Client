const express = require('express');

const mockStocks = require('../mockStocks');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    stocks: mockStocks
  });
});

module.exports = router;
