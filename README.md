# Task Manager (Frontend + Backend)

This repository contains a Next.js app with API routes and a MongoDB backend.

## Environment

Create a `.env.local` for local development (do NOT commit secrets).

Required env vars:
- `MONGODB_URI` — MongoDB connection string (production or dev).

See `.env.example` for a template.

## Local development

Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

## Deployment

1. Provision a MongoDB instance (MongoDB Atlas, MongoDB-hosted, or self-hosted).
2. Add `MONGODB_URI` to your deployment platform environment variables (Vercel, Railway, Render, etc.).
3. Build and start the app (on the host):

```bash
npm run build
npm start
```

Notes:
- Keep secrets out of the repository — use platform environment variables.
- If you want me to set a production `MONGODB_URI` in the repo, provide the URI and I can place it into a `.env.production` (not recommended for secret values).
 - Do NOT commit `.env.production` containing secrets. Use `.env.production.example` as a template.
 - I created a GitHub Actions workflow at `.github/workflows/ci.yml` that runs `npm ci` and `npm run build` on PRs and pushes to `main`.

Recommended quick deploy (Vercel)

1. Create a GitHub repo and push this project (see commands below).
2. Go to https://vercel.com, import the GitHub repo.
3. In Project Settings → Environment Variables, add `MONGODB_URI` (production) and any other secrets.
4. Deploy — Vercel will build and serve automatically.

Commands to push the prepared repo (run locally):

```bash
git init
git add .
git commit -m "Prepare project for deployment: add CI, env examples, remove secrets"
# create a GitHub repo, then add the remote and push
git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
git push -u origin main
```

After pushing, connect the repo in Vercel and add the `MONGODB_URI` in Vercel's Environment Variables.
