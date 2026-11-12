# FRAP Digital

> **Demo version.** This repository is a public demo with the client's branding, data and production configuration removed. For the deployable version (setup for your organization, data migration, hosting and support), contact me at **alonsohazed@gmail.com** or on [LinkedIn](https://www.linkedin.com/in/alexisalonsosalcido/).

Web app that replaces the paper **FRAP** (*Formato de Registro de Atención Prehospitalaria*), the patient-care report that ambulance crews in Mexico fill out on every call.

I built it for an ambulance service in Baja California. Crews fill the report during the call on a phone or tablet, collect signatures on screen, and the base can see it as soon as it's saved. When a printed copy is needed (hospital handoff, insurance, legal), the app generates a PDF laid out like the official paper form, so nothing downstream has to change.

## What it does

- **One login per ambulance unit**, plus an admin role that sees every report. Units only see their own.
- **Form split into tabs** (general data, vitals, physical exam, clinical scales, obstetrics, signatures) instead of one long page.
- **Body diagram** to mark injuries by tapping, and **signature pads** for patient, crew and receiving doctor.
- **Print-ready PDF** that reproduces the official two-page layout field by field.
- **Search** by folio or patient name, with auto-incrementing folios.
- Light and dark mode.

## Stack

| Part | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind, Radix UI |
| API | Cloudflare Pages Functions (serverless) |
| Database | Cloudflare D1 (SQLite) |
| Auth | bcrypt password hashes, HS256 JWT signed and verified with WebCrypto |
| PDF | jsPDF + html2pdf |
| CI | GitHub Actions: tests + build on every push |

An earlier version ran on React + FastAPI + MongoDB. This one moves the backend to Cloudflare Pages Functions + D1, so there is no server to run or patch.

## Project layout

```
functions/api/      HTTP endpoints (auth, FRAP CRUD)
server/auth.js      token signing/verification, user lookup
src/pages/          login, dashboard, form, detail
src/components/     body diagram, signature pad, printable FRAP
schema.sql          D1 tables
test/               auth tests (node:test)
```

## Running it locally

```bash
npm install
cp .env.example .env              # organization name, address, logo
cp .dev.vars.example .dev.vars    # JWT secret and users
npm run hash-password -- mypassword   # paste the hash into .dev.vars
npx wrangler d1 execute frap-database --local --file=./schema.sql
npm run build && npx wrangler pages dev dist
```

## Security notes

Patient data is sensitive, so:

- No credentials live in the repo. Users and the JWT secret are environment bindings (`wrangler pages secret put`).
- Tokens are verified on every request (signature + expiry). Tests cover forged, tampered and expired tokens.
- Units can only read and edit their own reports; only admins can delete.
- Branding (organization name, address, logo) is configuration, so the same build can serve another ambulance service.

## Deploy

```bash
npx wrangler d1 create frap-database      # put the id in wrangler.toml
npx wrangler d1 execute frap-database --file=./schema.sql
npx wrangler pages secret put JWT_SECRET
npx wrangler pages secret put USERS
npm run deploy
```
