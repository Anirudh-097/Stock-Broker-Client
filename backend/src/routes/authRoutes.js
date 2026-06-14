const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'Email is required'
    });
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email
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

  res.json({
    token,
    user
  });
});

module.exports = router;