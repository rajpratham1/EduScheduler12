# EduScheduler

FastAPI + Firebase Admin backend with Vite React TypeScript frontend for automated timetable generation, smart classroom allocation, role-based dashboards (Admin/Faculty/Student), feedback to admin email, and AI-assisted scheduling (Gemini).

## Prerequisites
- Python 3.10+
- Node 18+
- Firebase project: Firestore (Native), Google Sign-In enabled
- Service Account JSON for Firebase Admin
- Optional: `GEMINI_API_KEY` for AI scheduling
- SMTP credentials to receive feedback emails

## Backend
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export FIREBASE_CREDENTIALS_FILE=/abs/path/serviceAccount.json
export GEMINI_API_KEY=your_key
export SMTP_HOST=smtp.host
export SMTP_PORT=587
export SMTP_USER=user
export SMTP_PASS=pass
export SMTP_FROM=no-reply@eduscheduler
bash run.sh
```

## Frontend
```bash
cd frontend
npm i
echo "VITE_API_URL=http://localhost:8000" > .env.local
# add Firebase web app keys to .env.local
npm run dev
```

## Roles
After first login, set your user role to `admin` in Firestore `users/{uid}` to access Admin features.

