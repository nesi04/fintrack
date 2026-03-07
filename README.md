# FinTrack

Full-stack personal finance tracker with web and mobile clients.

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- Frontend (Web): React 18, Vite, React Router, React Query, Axios
- Mobile: Expo React Native, React Navigation, Zustand, SecureStore

## Project Structure

- `backend/` - API server and database models
- `frontend/` - web dashboard client
- `mobile/` - React Native app

## Features

### Authentication
- Register and login with JWT
- Protected API routes with bearer token middleware
- Current-user endpoint (`/api/auth/me`)

### Transactions
- Add income and expense transactions
- Filter transactions by type/category/date
- Update and delete transactions
- Category dropdowns in UI (including `rent`)

### Budgets
- Set monthly budget per category
- Auto-calculate spent amount from transactions
- View budget utilization with progress bars

### Analytics
- Summary: income, expense, balance, savings rate
- Spend-by-category aggregation
- Monthly trend (last 6 months)

### Web Dashboard UI
- Dark fintech-themed layout with fixed sidebar
- Active route highlighting in sidebar
- Overview stat cards
- SVG-based line and category charts
- Recent transactions and budget progress widgets
- Responsive layout for desktop/mobile widths

### Mobile App
- JWT persistence in `expo-secure-store`
- Auth flow + protected app flow
- Dashboard, transactions, and budget screens
- Zustand store for finance data

## API Endpoints

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Transactions
  - `GET /api/transactions`
  - `POST /api/transactions`
  - `PUT /api/transactions/:id`
  - `DELETE /api/transactions/:id`
- Budgets
  - `GET /api/budgets`
  - `POST /api/budgets`
  - `PUT /api/budgets/:id`
- Analytics
  - `GET /api/analytics/summary`
  - `GET /api/analytics/by-category`
  - `GET /api/analytics/monthly`

## Local Development

### 1. Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Set values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
JWT_EXPIRE=30d
NODE_ENV=development
```

3. Run:

```bash
cd backend
npm install
npm run dev
```

Backend URL: `http://localhost:5000/api`

### 2. Frontend

1. Copy `frontend/.env.example` to `frontend/.env`
2. Set value:

```env
VITE_API_URL=http://localhost:5000/api
```

3. Run:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

### 3. Mobile (Expo)

1. Copy `mobile/.env.example` to `mobile/.env`
2. Set value:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run:

```bash
cd mobile
npm install
npx expo start
```

## Deployment

## Deploy Backend on Render

1. Push project to GitHub.
2. In Render, create a new `Web Service` from your repo.
3. Configure:
- Root Directory: `backend`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`
4. Add environment variables in Render:
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRE=30d`
- `NODE_ENV=production`
- `PORT=10000` (optional; Render sets this automatically)
5. Deploy and copy backend URL, e.g. `https://fintrack-api.onrender.com`.

Your production API base URL will be:
- `https://fintrack-api.onrender.com/api`

## Deploy Frontend on Vercel

1. In Vercel, import the same GitHub repo.
2. Configure project:
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
3. Add environment variable in Vercel:
- `VITE_API_URL=https://fintrack-api.onrender.com/api`
4. Deploy.

## Post-Deploy Checklist

1. Open Vercel app and test register/login.
2. Create a transaction and verify it persists.
3. Check analytics and budget endpoints from UI.
4. If requests fail, verify API URL env vars on Vercel/Render and redeploy.

## Notes

- Web stores token in `localStorage`.
- Mobile stores token in `expo-secure-store`.
- For mobile on physical devices, set API URL to a reachable public URL or LAN IP.
