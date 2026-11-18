# Nookala Sri Krishna — Portfolio

Personal portfolio for **Nookala Sri Krishna**, B.Tech Computer Science & Engineering (AI & ML) student at **Jain University, Bengaluru** (`2025–2029`).

## Features

- **Hero & Academic Summary**: Overview, live IST clock, light/dark theme toggle, `⌘K` (or `/`) quick command palette, optional custom portrait upload, and semester GPA metrics (`9.02` Sem 1, `8.86` Sem 2, `8.94` mean).
- **Education & Credentials**: Interactive Semester GPA trajectory chart with hover tooltips, Udemy *100 Days of Code: The Complete Python Pro Bootcamp* certification, and language proficiencies (`English · Hindi · Telugu`).
- **Technical Stack & Skill Inspector**: Filterable 14-skill matrix across Languages, AI/ML Libraries, Web & Database, Core CS, and Development Tools with a contextual Skill Inspector panel.
- **Interactive Engineering Demos**:
  - **Jio Sense — Weather & Climate Dashboard**: City selector (`Hyderabad`, `Bengaluru`, `Delhi`), weather telemetry metrics, hourly / 7-day forecast charts, and climate advisories.
  - **JAIN Smart Navigation — Campus Digital Twin**: Floor schematics (`Floor 1–3`), clickable rooms, and natural-language campus availability queries.
- **Structured Enquiry & Messaging Channels (No Mobile Contact)**:
  - Mobile/phone numbers are intentionally excluded.
  - Visitors complete a validated 4-field enquiry form (**Your Name**, **What is your email?**, **What is your doubt?**, **Description about your doubt**) before unlocking direct message dispatch via **Email** (`srikrishnanookala18@gmail.com`), **LinkedIn**, or **GitHub**.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite
- **Backend**: Python 3 (`http.server` + `sqlite3` persistence), running natively as a **Vercel Python Serverless Function** (`/api/index.py`) in production and via Express proxy (`server.ts`) in local development

## Project Structure

```text
├── api/
│   └── index.py              # Vercel Python serverless function entrypoint
├── backend/                  # Python 3 REST API & SQLite persistence
│   ├── app.py                # Local Python backend entry point
│   ├── database.py           # SQLite schema & queries (uses /tmp on Vercel)
│   ├── portfolio_engine.py   # Campus NL query, weather comfort & GPA analytics
│   ├── server.py             # ThreadingHTTPServer JSON API
│   └── validators.py         # 4-field enquiry validation & channel formatting
├── src/
│   ├── assets/images/        # Studio hero image
│   ├── components/           # Modular React UI sections
│   ├── data/portfolioData.ts # Profile, skills, GPA, weather & campus data
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── server.ts                 # Local Express dev/prod server + Python process supervisor
└── vercel.json               # Vercel build, Python API rewrite & SPA fallback config
```

## Local Development

### Prerequisites
- Node.js 20+ (tested on Node 22)
- Python 3.10+

### Install & Run
```bash
npm install
npm run dev
```
The app runs at `http://localhost:3000`, with Express serving the Vite frontend and proxying `/api/*` requests to the Python backend.

### Typecheck & Build
```bash
npm run lint
npm run build
```

## Deploying to Vercel

### Option 1: GitHub + Vercel (Recommended)
1. Push this repository to GitHub.
2. Go to **vercel.com/new** and import your GitHub repository.
3. Vercel automatically reads `vercel.json`:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Python API**: Automatically deploys `api/index.py` (with `backend/`) as a Python Serverless Function for `/api/*`.
4. Click **Deploy**.

### Option 2: Vercel CLI
```bash
npx vercel --prod
```

## Contact Channels

Messages are accepted exclusively after filling out the portfolio enquiry form via:
- **Email**: `srikrishnanookala18@gmail.com`
- **LinkedIn**: [sri-krishna-nookala](https://www.linkedin.com/in/sri-krishna-nookala-19758a44b)
- **GitHub**: [srikrishnanookala18-lab](https://github.com/srikrishnanookala18-lab)
