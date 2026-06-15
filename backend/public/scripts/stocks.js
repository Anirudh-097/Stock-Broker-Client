const TOKEN_KEY = 'stockBrokerToken';

const token = localStorage.getItem(TOKEN_KEY);
const tableBody = document.querySelector('[data-stock-table]');
const statusEl = document.querySelector('[data-status]');
const userEl = document.querySelector('[data-user]');
const logoutButton = document.querySelector('[data-logout]');
const rows = new Map();
const subscriptions = new Set();

const redirectToLogin = () => {
  window.location.assign('/login');
};

const setStatus = (text, className) => {
  statusEl.textContent = text;
  statusEl.className = `feed-status ${className}`;
};

const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    redirectToLogin();
    return null;
  }

  return response;
};

const formatPrice = (value) => Number(value).toFixed(2);

const formatChange = (value) => (
  value > 0 ? `+${formatPrice(value)}` : formatPrice(value)
);

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const setOwnedState = (ticker) => {
  const row = rows.get(ticker);

  if (!row) {
    return;
  }

  const isOwned = subscriptions.has(ticker);
  const statusCell = row.querySelector('[data-owned]');
  const button = row.querySelector('[data-buy]');

  statusCell.textContent = isOwned ? 'Owned' : 'Available';
  statusCell.className = `holding ${isOwned ? 'owned' : 'available'}`;
  button.textContent = isOwned ? 'Owned' : 'Buy';
  button.disabled = isOwned;
};

const renderStocks = (stocks) => {
  tableBody.innerHTML = stocks.map((stock) => `
    <tr data-ticker="${escapeHtml(stock.ticker)}">
      <td>
        <div class="ticker-cell">
          <span class="ticker">${escapeHtml(stock.ticker)}</span>
          <span class="company">${escapeHtml(stock.name)}</span>
        </div>
      </td>
      <td>${escapeHtml(stock.exchange)}</td>
      <td>${escapeHtml(stock.sector)}</td>
      <td class="price" data-price>${formatPrice(stock.price)}</td>
      <td class="change neutral" data-change>0.00</td>
      <td class="holding available" data-owned>Available</td>
      <td>
        <button
          class="buy-button"
          type="button"
          data-buy
          data-buy-ticker="${escapeHtml(stock.ticker)}"
        >
          Buy
        </button>
      </td>
    </tr>
  `).join('');

  rows.clear();
  document.querySelectorAll('[data-ticker]').forEach((row) => {
    rows.set(row.dataset.ticker, row);
    setOwnedState(row.dataset.ticker);
  });
};

const updateRow = ({
  ticker,
  price,
  change = 0
}) => {
  const row = rows.get(ticker);

  if (!row || typeof price !== 'number') {
    return;
  }

  const changeEl = row.querySelector('[data-change]');

  row.querySelector('[data-price]').textContent = formatPrice(price);
  changeEl.textContent = formatChange(change);
  changeEl.className = 'change';
  changeEl.classList.add(
    change > 0
      ? 'positive'
      : change < 0
        ? 'negative'
        : 'neutral'
  );
};

const loadAccount = async () => {
  const response = await apiFetch('/api/auth/me');

  if (!response) {
    return false;
  }

  if (!response.ok) {
    localStorage.removeItem(TOKEN_KEY);
    redirectToLogin();
    return false;
  }

  const user = await response.json();
  userEl.textContent = user.email;

  return true;
};

const loadSubscriptions = async () => {
  const response = await apiFetch('/api/sub');

  if (!response || !response.ok) {
    return;
  }

  const payload = await response.json();

  subscriptions.clear();
  payload.subscriptions.forEach((ticker) => {
    subscriptions.add(ticker);
    setOwnedState(ticker);
  });
};

const buyStock = async (ticker, button) => {
  button.disabled = true;
  button.textContent = 'Buying';

  const response = await apiFetch('/api/sub', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ticker })
  });

  if (!response || !response.ok) {
    button.disabled = false;
    button.textContent = 'Buy';
    return;
  }

  const payload = await response.json();

  subscriptions.clear();
  payload.subscriptions.forEach((subscription) => {
    subscriptions.add(subscription);
  });
  rows.forEach((row) => setOwnedState(row.dataset.ticker));
};

const loadStocks = async () => {
  const response = await fetch('/api/stocks');
  const payload = await response.json();

  renderStocks(payload.stocks);
};

const startLivePrices = () => {
  if (typeof io !== 'function') {
    setStatus('Offline', 'disconnected');
    return;
  }

  const socket = io();

  socket.on('connect', () => {
    setStatus('Live', 'connected');

    rows.forEach((row, ticker) => {
      socket.emit('stock:join', ticker);
    });
  });

  socket.on('disconnect', () => {
    setStatus('Offline', 'disconnected');
  });

  socket.on('stock:price', updateRow);
};

tableBody.addEventListener('click', (event) => {
  const button = event.target.closest('[data-buy]');

  if (!button || button.disabled) {
    return;
  }

  buyStock(button.dataset.buyTicker, button);
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('stockBrokerEmail');
  redirectToLogin();
});

const boot = async () => {
  if (!token) {
    redirectToLogin();
    return;
  }

  const isAuthenticated = await loadAccount();

  if (!isAuthenticated) {
    return;
  }

  await loadStocks();
  await loadSubscriptions();
  startLivePrices();
};

boot();
