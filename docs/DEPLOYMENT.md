# Deployment Guide

## Backend on Render
1. Create a new Web Service on Render.
2. Point it to `backend/server`.
3. Add environment variables in Render dashboard.
4. Start command: `node server.js`.

## GitHub Actions CI/CD
- Workflow file: `.github/workflows/deploy-to-render.yml`
- On every push to `main`, triggers Render deploy.
- Requires GitHub secrets:
  - `RENDER_API_KEY`
  - `RENDER_SERVICE_ID`

## Frontend Deployment
- Deploy frontend separately on **Vercel** or **Netlify**.
