const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login | Stock Broker</title>
    <link rel="stylesheet" href="/styles/stocks.css">
  </head>
  <body>
    <main class="auth-shell">
      <section class="auth-panel" aria-labelledby="login-title">
        <p class="eyebrow">Stock Broker</p>
        <h1 id="login-title">Sign in</h1>
        <form class="login-form" data-login-form>
          <label for="email">Email</label>
          <div class="input-row">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              required
            >
            <button type="submit">Continue</button>
          </div>
          <p class="form-message" data-message></p>
        </form>
      </section>
    </main>
    <script src="/scripts/login.js"></script>
  </body>
</html>`);
});

router.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Stocks | Stock Broker</title>
    <link rel="stylesheet" href="/styles/stocks.css">
  </head>
  <body>
    <main class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Market</p>
          <h1>Stocks</h1>
        </div>
        <div class="header-actions">
          <div class="user-pill" data-user>Loading user</div>
          <div class="feed-status" data-status>Connecting</div>
          <button class="secondary-button" type="button" data-logout>Logout</button>
        </div>
      </header>

      <section class="market-panel" aria-label="Stock prices">
        <table>
          <thead>
            <tr>
              <th scope="col">Stock</th>
              <th scope="col">Exchange</th>
              <th scope="col">Sector</th>
              <th scope="col">Price</th>
              <th scope="col">Move</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody data-stock-table>
            <tr>
              <td colspan="7" class="empty-state">Loading stocks</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <script src="/socket.io/socket.io.js"></script>
    <script src="/scripts/stocks.js"></script>
  </body>
</html>`);
});

module.exports = router;
