
# EduScheduler - Cleaned & Backend Added

This cleaned package removed heavy `node_modules` and build artifacts. It includes a new Express backend at `backend/server/` which uses Firebase Admin SDK to interact with Firestore.

## Setup (local)

1. Install dependencies:
   ```
   cd backend/server
   npm install
   ```

2. Set environment variables (use `.env` or Render secrets):
   - `FIREBASE_ADMIN_SDK_JSON` : JSON string of Firebase service account key
   - `FIREBASE_DATABASE_URL` : e.g. https://<your-project>.firebaseio.com
   - `PORT` : optional

3. Start:
   ```
   npm start
   ```

## Deployment

- Deploy backend to Render as a Node service, or to any VPS.
- Frontend can be built and served separately (this package preserves original frontend).
- For Firebase Rules and Auth, configure in Firebase console.

## Gemini integration
The repo includes a placeholder for Gemini API integration — set `GEMINI_API_KEY` and add requests where needed.

