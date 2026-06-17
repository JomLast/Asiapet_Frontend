# AsiaPet EHR — Frontend

Thai-language Electronic Health Record system for veterinary clinics, built with React 18 + Vite + TypeScript.

## Requirements

- Node.js 18+
- The AsiaPet backend running on port 4000 — clone & run [`Asiapet_Backend`](https://github.com/JomLast/Asiapet_Backend) (`npm install && npm run seed && npm run dev`). It is self-contained (content seed bundled).

## Setup

```bash
cp .env.example .env
npm install
```

## Running

```bash
# Development (with hot reload + proxy to backend on :4000)
npm run dev

# Type-check only
npm run typecheck

# Production build
npm run build

# Preview production build
npm run preview
```

The app will be available at http://localhost:5173

## Backend requirement

The REST API backend must be running at `http://localhost:4000` before using the app. The Vite dev server proxies all `/api/*` requests to the backend automatically.

## Demo credentials

```
Email:    vet@asiapet.local
Password: asiapet123
```

## Environment variables

| Variable       | Default                        | Description             |
|----------------|--------------------------------|-------------------------|
| VITE_API_URL   | http://localhost:4000/api      | Backend API base URL    |

## Deploy (static host)

This is a pure client SPA — host the build anywhere static (Netlify / Vercel / Cloudflare Pages):

```bash
# point at your deployed backend, then build
echo "VITE_API_URL=https://your-backend-host/api" > .env
npm run build        # → dist/
# upload the dist/ folder to your static host
```

The backend is the subscription "brain" (auth + per-clinic license + data). For the full subscription
deployment guide (backend hosting, clinic provisioning, renewals), see **`DEPLOY.md` in the `Asiapet_Backend` repo**.

## Project structure

```
src/
  api/          Typed fetch client (client.ts, auth.ts, patients.ts, content.ts)
  components/   Shared UI components (layout, sidebar, table, badges)
  features/     Feature modules (auth, patients, visits, drugs, diseases)
  i18n/         Thai string dictionary (th.ts)
  store/        Auth context + token management
  App.tsx       Router + providers
  main.tsx      Entry point
```

## Routes

| Path                | Description           |
|---------------------|-----------------------|
| /login              | Login screen          |
| /                   | Home (dashboard)      |
| /patients           | Patients list         |
| /patients/:hn       | Patient detail + tabs |
| /drugs              | Drug reference        |
| /diseases           | Disease library       |
