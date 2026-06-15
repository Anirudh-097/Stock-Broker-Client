const express = require('express');
const path = require('path');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const stockRoutes = require('./routes/stockRoutes');
const subscriptionRoutes = require(
  './routes/subRoutes'
);

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.static(
    path.join(__dirname, '..', 'public')
  )
);

app.use('/', pageRoutes);
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sub', subscriptionRoutes);
app.use('/api/stocks', stockRoutes);

module.exports = app;
