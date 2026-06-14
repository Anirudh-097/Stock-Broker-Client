const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok'
  });
});

router.get('/db', (req, res) => {
  res.json({
    connected: mongoose.connection.readyState === 1
  });
});

module.exports = router;