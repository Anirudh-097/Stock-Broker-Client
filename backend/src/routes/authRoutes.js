const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const isValidEmail = (email) => (
  typeof email === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
);

router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: 'Invalid email'
      });
    }

    let user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      user = await User.create({
        email: normalizedEmail
      });
    }

    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    return res.json({
      token,
      user
    });
  } catch {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.json(user);
  } catch {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;
