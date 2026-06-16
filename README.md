# AsiaPet EHR — Frontend

Thai-language Electronic Health Record system for veterinary clinics, built with React 18 + Vite + TypeScript.

## Requirements

- Node.js 18+
- Backend running on port 4000 (see `D:\VetAsiaPet\backend`)

## Setup

```bash
cd frontend
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
