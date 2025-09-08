# Setup Instructions

## Requirements
- Node.js v18+
- Firebase Project (Firestore + Auth + Cloud Messaging)
- Gemini API Key (for AI integration)
- Render Account (for deployment)

## Environment Variables
- FIREBASE_ADMIN_SDK_JSON
- FIREBASE_DATABASE_URL
- GEMINI_API_KEY
- RENDER_API_KEY
- RENDER_SERVICE_ID

## Local Setup
```bash
# Backend
cd backend/server
npm install
npm start

# Frontend
npm install
npm run dev
```
