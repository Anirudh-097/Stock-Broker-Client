# Stock Broker Client

Backend API for a stock subscription dashboard.

## Services

- `backend`: Express API for authentication, health checks, and stock subscriptions.
- `mongodb`: MongoDB database used by the backend.

## Run With Docker

```sh
docker compose up --build
```

The API listens on `http://localhost:5000`.

Open `http://localhost:5000/login` to sign in with an email address. New users are created in MongoDB with no stock subscriptions, then redirected to `http://localhost:5000/` to view and buy stocks.

## Backend Development

```sh
cd backend
npm install
npm test
npm run dev
```

Set these environment variables when running outside Docker:

- `PORT`: API port, defaults to `5000`.
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret used to sign authentication tokens.

For frontend-only mock development, `MONGO_URI` can be omitted. The stock page and realtime mock prices will still run, but database-backed API routes require MongoDB.

## API

- `GET /health`: basic service health.
- `GET /health/db`: database connection health.
- `POST /api/auth/login`: accepts `{ "email": "user@example.com" }` and returns a JWT.
- `GET /api/auth/me`: returns the authenticated user.
- `GET /api/stocks`: lists supported stock metadata for the page.
- `GET /api/sub`: lists authenticated user subscriptions.
- `POST /api/sub`: accepts `{ "ticker": "GOOG" }` for supported stocks.

## Realtime Stock Prices

Socket.IO is served from the backend. Clients join only the ticker rooms they need:

- `stock:join` with a ticker string such as `"GOOG"` joins `stock:GOOG`.
- `stock:leave` with a ticker string leaves that ticker room.
- `stock:price` emits one price update per second to each relevant ticker room only.

Each price tick changes the stock price by a random value from `-5` to `+5`.
