const express = require('express');

const mockStocks = require('../mockStocks');

const router = express.Router();

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const renderStockRows = (stocks) => stocks.map((stock) => `
  <tr data-ticker="${escapeHtml(stock.ticker)}">
    <td>
      <div class="ticker-cell">
        <span class="ticker">${escapeHtml(stock.ticker)}</span>
        <span class="company">${escapeHtml(stock.name)}</span>
      </div>
    </td>
    <td>${escapeHtml(stock.exchange)}</td>
    <td>${escapeHtml(stock.sector)}</td>
    <td class="price" data-price>${stock.price.toFixed(2)}</td>
    <td class="change neutral" data-change>0.00</td>
    <td class="updated" data-updated>Waiting</td>
  </tr>
`).join('');

router.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Stock Broker Dashboard</title>
    <link rel="stylesheet" href="/styles/stocks.css">
  </head>
  <body>
    <main class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Phase 1</p>
          <h1>Stocks</h1>
        </div>
        <div class="feed-status" data-status>Connecting</div>
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
              <th scope="col">Updated</th>
            </tr>
          </thead>
          <tbody>
            ${renderStockRows(mockStocks)}
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
