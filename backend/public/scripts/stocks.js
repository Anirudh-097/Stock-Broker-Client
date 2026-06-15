const statusEl = document.querySelector('[data-status]');
const rows = new Map(
  [...document.querySelectorAll('[data-ticker]')]
    .map((row) => [row.dataset.ticker, row])
);

const setStatus = (text, className) => {
  statusEl.textContent = text;
  statusEl.className = `feed-status ${className}`;
};

const formatPrice = (value) => Number(value).toFixed(2);

const formatTime = (value) => {
  if (!value) {
    return 'Now';
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    }
  ).format(new Date(value));
};

const flashRow = (row, change) => {
  row.classList.remove('flash-up', 'flash-down');

  if (change === 0) {
    return;
  }

  const className = change > 0 ? 'flash-up' : 'flash-down';
  row.classList.add(className);

  window.setTimeout(() => {
    row.classList.remove(className);
  }, 350);
};

const updateRow = ({
  ticker,
  price,
  change = 0,
  timestamp
}) => {
  const row = rows.get(ticker);

  if (!row || typeof price !== 'number') {
    return;
  }

  const changeEl = row.querySelector('[data-change]');

  row.querySelector('[data-price]').textContent = formatPrice(price);
  row.querySelector('[data-updated]').textContent = formatTime(timestamp);

  changeEl.textContent = change > 0
    ? `+${formatPrice(change)}`
    : formatPrice(change);
  changeEl.className = 'change';
  changeEl.classList.add(
    change > 0
      ? 'positive'
      : change < 0
        ? 'negative'
        : 'neutral'
  );

  flashRow(row, change);
};

if (typeof io !== 'function') {
  setStatus('Offline', 'disconnected');
} else {
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
}
