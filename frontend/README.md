# Frontend

A React chat interface for the FastAPI supportive mental-coach backend.

## Requirements

- Node.js 18 or newer (npm is included with Node.js)
- The backend running from the repository root at `http://127.0.0.1:8000`
- `OPENAI_API_KEY` set in the repository-root `.env` file

## Run locally

Open a terminal in this directory and install the frontend dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`). Keep the
backend running in a separate terminal. The Vite development server proxies
`/api` requests to `http://127.0.0.1:8000`.

To create a production build:

```powershell
npm run build
```
