const express = require('express');

const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { SUPPORTED_STOCKS } = require('../constants');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const { ticker } = req.body;

      if (!ticker || typeof ticker !== 'string') {
        return res.status(400).json({
          message: 'Ticker is required'
        });
      }

      const normalizedTicker =
        ticker.trim().toUpperCase();

      if (
        !SUPPORTED_STOCKS.includes(
          normalizedTicker
        )
      ) {
        return res.status(400).json({
          message: 'Unsupported stock'
        });
      }

      const user =
        await User.findByIdAndUpdate(
          req.user.userId,
          {
            $addToSet: {
              subscriptions:
                normalizedTicker
            }
          },
          {
            new: true
          }
        );

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      return res.status(200).json({
        subscriptions:
          user.subscriptions
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
);

router.get(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.userId
      );

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      return res.status(200).json({
        subscriptions:
          user.subscriptions
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
);

module.exports = router;
