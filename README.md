<<<<<<< HEAD
# EduSchedulerClean
=======
<<<<<<< HEAD
# EduScheduler — SIH25028

**Complete Documentation for presentation & deployment**

> Prepared for: Smart India Hackathon (SIH) — Project Code: SIH25028

---

## Table of Contents

1. Project summary (abstract)
2. Problem statement & objectives
3. Solution overview
4. Key features
5. System architecture
6. Technology stack
7. Repository structure
8. Setup & prerequisites
9. Environment variables
10. Firebase setup (step-by-step)
11. Local development (run & test)
12. Database schema (Firestore collections)
13. API reference (endpoints)
14. Authentication & authorization
15. Frontend integration (code snippets)
16. 3D / Animation integration details
17. Postman collection usage
18. GitHub Actions + Render deployment guide
19. Demo script (for SIH presentation)
20. Testing & verification commands
21. Troubleshooting & common issues
22. Security & privacy considerations
23. Performance & scalability notes
24. Future enhancements roadmap
25. Appendix: sample prompts, .env example, license & credits

---

## 1. Project summary (abstract)

EduScheduler is a smart timetable application designed for educational institutions. It integrates automated schedule suggestion using a large language model (Gemini), centralized management via an Admin panel (classes, labs, faculty), and real-time push notifications using Firebase Cloud Messaging. The project targets both web and mobile clients and includes lightweight 3D/animation elements to enhance UI/UX without changing your existing interface.

This documentation describes how the code is organized, how to run it locally, deploy it to Render, integrate with Firebase and Gemini, and demonstrate the application at SIH.

---

## 2. Problem statement & objectives

**Problem:** Manual timetable creation and management is time-consuming, error-prone, and hard to adapt when constraints (faculty availability, lab capacity, holidays) change. Communication of updates to stakeholders (students, faculty) is often manual and unreliable.

**Objectives:**

* Provide an Admin panel to manage classes, labs, and faculty.
* Auto-suggest timetable slots using Gemini to reduce manual effort.
* Allow students and faculty to receive real-time notifications (FCM).
* Keep the existing UI unchanged while adding a robust backend and features.
* Make the solution deployable (Render, GitHub Actions) and mobile/web friendly.

---

## 3. Solution overview

EduScheduler includes:

* Frontend (React + TypeScript + Vite): existing UI preserved. New components added (Three.js stage and Lottie animation) as optional widgets.
* Backend (Node.js + Express): API endpoints to manage classes, feedback, notifications, device registration, and Gemini integration.
* Firebase Admin SDK: used by the backend for Firestore and FCM.
* Gemini integration: an API endpoint that calls the model (if provided with `GEMINI_API_KEY`) to generate timetable suggestions; a deterministic fallback exists for testing without an API key.
* CI/CD: GitHub Actions workflow to trigger Render deployments automatically.

---

## 4. Key features

* Role-based Admin functionality (manage classes, faculty, labs, notifications).
* Student & Faculty panels (feedback submission, view schedules, notifications).
* Gemini-powered schedule suggestion endpoint with a safe fallback.
* Firebase Cloud Messaging support for device registration & admin-triggered notifications.
* Lightweight 3D (three.js) and Lottie animations added as optional components.
* Postman collection and GitHub Actions for quick testing and deployment.

---

## 5. System architecture (textual)

```
+-----------------+            +-----------------+           +------------------+
| Frontend (Web)  | <------->  |  Backend (Node) |  <----->  |  Firebase (Auth, |
| React + Vite    |  HTTPS     | Express + Admin |  Firestore & FCM) |
+-----------------+            +-----------------+           +------------------+
         ^                             ^                       
         |                             |                       
         | Three.js / Lottie           | Gemini API (optional)
         v                             v                       
     Mobile clients                 Admin actions             External AI API
```

* Frontend communicates with backend via REST. Backend performs token verification via Firebase Admin SDK and interacts with Firestore and FCM.
* Gemini is optional: backend will call the external model endpoint when API keys are present.

---

## 6. Technology stack

* Frontend: React, TypeScript, Vite
* Backend: Node.js (Express), `node-fetch` for outbound HTTP
* Database & Auth: Firebase (Firestore, Firebase Auth)
* Messaging: Firebase Cloud Messaging (FCM)
* 3D/Animation: three.js (dynamic import), lottie-web
* CI/CD: GitHub Actions, Render deployment

---

## 7. Repository structure (high level)

```
/ (project root)
├─ backend/
│  └─ server/
│     ├─ server.js            # Express server with endpoints
│     ├─ package.json
│     └─ postman_collection.json
├─ src/                      # React frontend (existing UI preserved)
│  ├─ components/
│  │  ├─ ThreeStage.tsx       # three.js component
│  │  └─ LottieBanner.tsx     # Lottie component
│  └─ ...
├─ public/animations/sample.json
├─ .github/workflows/deploy-to-render.yml
├─ README_CLEANED.md
└─ README_MODIFIED.txt
```

> Note: The cleaned distribution removes `node_modules`, `dist` and other build artefacts to keep repo small. Run `npm install` in backend/server and frontend root as needed.

---

## 8. Setup & prerequisites

* Node.js (v16+ recommended)
* npm (v8+)
* Firebase account & project
* Render account (optional for deployment)
* (Optional) Gemini API key if you want AI-driven schedule generation

Local tools:

* Git
* curl or Postman for API testing

---

## 9. Environment variables

Create a `.env` or set environment variables in your host (Render / GitHub secrets). Important variables:

* `FIREBASE_ADMIN_SDK_JSON` — **Required** for production backend. This should be the entire Service Account JSON stringified (one-line or multiline depending on host). Example: `{"type":"service_account", ... }`.
* `FIREBASE_DATABASE_URL` — optional, the database URL if needed (for RTDB). Example: `https://<project-id>.firebaseio.com`
* `GEMINI_API_KEY` — optional. If provided, backend will contact Gemini API. Keep secret.
* `GEMINI_API_URL` — optional, the API URL for Gemini (defaults to placeholder if not set).
* `PORT` — backend listening port (default `8080`).
* `RENDER_API_KEY` & `RENDER_SERVICE_ID` — GitHub secrets used by workflow to trigger Render deploys.

**Important:** Never commit `FIREBASE_ADMIN_SDK_JSON` into Git. Use host secrets.

---

## 10. Firebase setup (step-by-step)

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore (Native mode) and create required collections: `classes`, `faculty`, `feedback`, `notifications`, `deviceTokens`.
3. Enable Firebase Authentication (Email/Password or Google). Create a few test users.
4. Create a Service Account JSON (Project Settings → Service Accounts → Generate new private key). Download the JSON.
5. In Render or your local `.env`, set `FIREBASE_ADMIN_SDK_JSON` to the contents of the service account JSON.
6. To mark an admin user, use the Admin SDK to set a custom claim (see example below).

### Set admin claim (example using Node REPL or a one-off script)

```js
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
// Set custom claim for UID 'abc123'
admin.auth().setCustomUserClaims('abc123', { admin: true }).then(()=> console.log('done'));
```

---

## 11. Local development (run & test)

### Backend

```bash
cd backend/server
npm install
# ensure env vars are set (e.g. FIREBASE_ADMIN_SDK_JSON string)
npm start
# server runs at http://localhost:8080
```

### Frontend

```bash
# project root (where package.json for frontend resides)
npm install
npm run dev
```

> If you see CORS errors, ensure the backend has `app.use(cors())` enabled (it is in `server.js`).

---

## 12. Database schema (Firestore collections)

Below are suggested fields for each collection. Firestore is schemaless; adapt as required.

### `classes` collection (documents)

```json
{
  "name": "Math 101",
  "code": "MTH101",
  "duration": 1,
  "facultyId": "uid_faculty_1",
  "room": "Room A101",
  "lab": null,
  "createdAt": "Firestore.Timestamp",
  "createdBy": "uid_admin"
}
```

### `faculty` collection

```json
{
  "name": "Dr. Anil Sharma",
  "email": "anil@college.edu",
  "uid": "uid_faculty_1",
  "availability": { "mon":["9-11"], "tue":["2-4"] }
}
```

### `feedback` collection

```json
{
  "userId": "uid_student_1",
  "message": "The timetable has a clash on Monday.",
  "createdAt": "Firestore.Timestamp"
}
```

### `notifications` collection

```json
{
  "title": "Timetable Updated",
  "body": "New timetable uploaded by admin.",
  "createdAt": "Firestore.Timestamp",
  "createdBy": "uid_admin",
  "targetUid": "uid_student_1" // nullable
}
```

### `deviceTokens` collection (doc id = uid)

```json
{
  "token": "fcm-device-token-string",
  "platform": "web/android/ios",
  "updatedAt": "Firestore.Timestamp",
  "uid": "uid_student_1"
}
```

---

## 13. API reference (detailed)

> Base URL: `https://<backend-host>/api`

### `GET /api/health`

* **Auth:** none
* **Response:** 200 OK

```json
{ "status": "ok", "time": "2025-09-07T...Z" }
```

---

### `GET /api/classes`

* **Auth:** none (read-only)
* **Description:** List classes (latest first)
* **Response:** `[{ id, name, code, duration, ... }, ...]`

---

### `POST /api/classes`

* **Auth:** Bearer Firebase ID Token (user must be authenticated)
* **Body:** JSON

```json
{ "name": "Math 101", "code": "MTH101", "duration": 1 }
```

* **Response:** `{ "id": "<new-doc-id>" }`

---

### `POST /api/feedback`

* **Auth:** Bearer token
* **Body:** `{ "message": "..." }`
* **Response:** `{ "id": "..." }`

---

### `POST /api/register-token`

* **Auth:** Bearer token
* **Body:** `{ "token": "<fcm-token>", "platform": "web" }`
* **Description:** Registers device token to `deviceTokens` collection with doc id = `uid`.
* **Response:** `{ "ok": true }`

---

### `POST /api/notifications/send`

* **Auth:** Bearer token (admin only — custom claim `admin: true` required)
* **Body:** `{"title":"...","body":"...","targetUid":"<uid>"}` or `{"title":"...","body":"...","topic":"topic-name"}`
* **Description:** Sends via FCM to a specific device token or topic and logs notification in Firestore.
* **Response:** `{ "result": "<fcm-message-id>" }`

---

### `POST /api/gemini/suggest-schedule`

* **Auth:** Bearer token
* **Body:** `{ "classes": [{"name":"Math","duration":1,...}], "constraints": {...} }`
* **Description:** Uses an LLM (Gemini) to create suggested schedule. If `GEMINI_API_KEY` is not set falls back to a deterministic round-robin suggestion.
* **Response (fallback):**

```json
{
  "source": "naive",
  "suggestion": [{"name":"Math","suggestedSlot":"Day 1 - Slot 1"}, ...]
}
```

* **Response (AI):** \`{ "source":"gemini", "raw": {...}, "suggestion": \[...] }

---

## 14. Authentication & authorization

* **Authentication:** Firebase Authentication on the frontend. The frontend should obtain a Firebase ID token after user sign-in and attach `Authorization: Bearer <idToken>` header to authenticated API calls.
* **Backend verification:** `verifyToken` middleware uses `admin.auth().verifyIdToken(token)` to extract `req.user` which contains `uid`, `email` and custom claims.
* **Admin role:** Backend checks `req.user.admin` (custom claim) for admin-only endpoints.

**How to create test tokens:**

* Sign in from the frontend to obtain ID token (recommended for manual testing).
* Alternatively, create a custom token via Admin SDK and exchange using client SDK.

---

## 15. Frontend integration (code snippets)

### Authenticate user & get ID token (example using Firebase client SDK)

```ts
import { getAuth } from 'firebase/auth';
const auth = getAuth();
const user = auth.currentUser;
if (user) {
  const idToken = await user.getIdToken();
  // Use in fetch
  fetch('/api/classes', { headers: { Authorization: `Bearer ${idToken}` } });
}
```

### Register device token (web push example)

```ts
// After obtaining FCM token on client (via firebase/messaging)
await fetch('/api/register-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
  body: JSON.stringify({ token: fcmToken, platform: 'web' })
});
```

### Call Gemini suggestion endpoint

```ts
const resp = await fetch('/api/gemini/suggest-schedule', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
  body: JSON.stringify({ classes: classesArray, constraints: {} })
});
const data = await resp.json();
console.log(data);
```

### Admin sending notification (example)

```ts
await fetch('/api/notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminIdToken}` },
  body: JSON.stringify({ title: 'Update', body: 'New timetable', targetUid: 'student_uid' })
});
```

---

## 16. 3D / Animation integration details

Two self-contained components were added under `src/components`:

1. **ThreeStage.tsx** — dynamically imports `three` and renders a small rotating cube. Intended to be a non-blocking addition; if the UI doesn't import the component nothing changes.
2. **LottieBanner.tsx** — dynamically imports `lottie-web` and plays a small built-in animation in `public/animations/sample.json`.

**Usage:** Import and add to your page where you want effects. They are optional and do not modify existing UI structure.

**Performance tips:**

* Lazy-load these components where possible.
* Limit animation frame size and complexity on mobile devices.

---

## 17. Postman collection usage

* File: `backend/postman_collection.json` — import into Postman.
* Create environment variables: `baseUrl` (e.g., `http://localhost:8080`) and `idToken` (your Firebase ID token).
* Run collection requests: health, classes, create class, Gemini suggestion.

---

## 18. GitHub Actions + Render deployment guide

**Prerequisites:**

* A Render account and a created Web Service (Node) configured to point to your repo.
* GitHub repository with the project code.

**Steps:**

1. In GitHub repository → Settings → Secrets, add:

   * `RENDER_API_KEY` (found in Render dashboard)
   * `RENDER_SERVICE_ID` (the service id for your Render service)
2. The workflow `.github/workflows/deploy-to-render.yml` triggers on push to `main` and hits the Render API to create a deploy.
3. In Render service settings, configure build & start commands. For backend-only deployment you can set `Root Directory` to `backend/server` and Start Command `npm start`.
4. Add environment variables in Render (FIREBASE\_ADMIN\_SDK\_JSON, FIREBASE\_DATABASE\_URL, GEMINI\_API\_KEY, GEMINI\_API\_URL) via Render Dashboard → Environment → Set Secrets.

**Note:** GitHub Action provided performs a simple deploy trigger; you can expand it to include build steps or tests.

---

## 19. Demo script (for SIH presentation)

**Goal:** Show a working flow in \~5–8 minutes.

1. **Preparation (before demo):**

   * Deploy backend to Render (or run locally).
   * Ensure Firestore has no critical data; pre-create an admin user and set `admin` custom claim.
   * Ensure frontend is built and accessible.
2. **Start demo:**

   * Open the application (web UI).
   * Sign in as Admin. Navigate to Admin panel (show class/faculty management unchanged UI).
   * Create a new class via front-end UI (calls `POST /api/classes`), show Firestore entry.
   * Request a timetable suggestion (calls `/api/gemini/suggest-schedule`), show returned suggestion (either AI or fallback).
   * Show how a student registers device token (simulate web push) and admin sends a notification to that student via `POST /api/notifications/send`.
   * Show the 3D / Lottie visual elements integrated smoothly in the interface.
3. **Wrap up:** Mention architecture & how Gemini helps automate scheduling. Mention future improvements.

---

## 20. Testing & verification commands

### Health check

```bash
curl http://localhost:8080/api/health
```

### Create class (requires id token)

```bash
curl -X POST http://localhost:8080/api/classes \
 -H "Authorization: Bearer <ID_TOKEN>" \
 -H "Content-Type: application/json" \
 -d '{"name":"Math 101","code":"MTH101"}'
```

### Gemini suggestion (test fallback)

```bash
curl -X POST http://localhost:8080/api/gemini/suggest-schedule \
 -H "Authorization: Bearer <ID_TOKEN>" \
 -H "Content-Type: application/json" \
 -d '{"classes":[{"name":"Math","duration":1}] }'
```

---

## 21. Troubleshooting & common issues

* **Admin SDK not initialized**: Ensure `FIREBASE_ADMIN_SDK_JSON` is set and valid JSON. On some hosts you may need to replace newlines with `\n` if storing as single-line env var.
* **CORS errors**: Confirm backend is running and has `cors()` configured; check browser console.
* **FCM send errors**: Ensure your Service Account has `Cloud Messaging` permissions and that device tokens are valid (tokens expire/revoke). For web push ensure you configured `firebase-messaging-sw.js` if using service worker.
* **Gemini API failures**: Check `GEMINI_API_KEY` and `GEMINI_API_URL`; examine logs for raw response body.

---

## 22. Security & privacy considerations

* Never commit secrets (service account JSON, API keys) to Git.
* Use HTTPS in production.
* Validate and sanitize incoming data; consider Firestore rules for additional protection.
* Manage admin access carefully using custom claims; rotate keys when staff changes.

---

## 23. Performance & scalability notes

* Use Firestore indexes for queries likely to grow (e.g., class queries by faculty).
* Use server-side pagination / limits in endpoints to avoid large responses.
* For high notification volume, consider queuing (Cloud Tasks) and batched FCM messaging.
* Consider Cloud Functions to handle heavy offloads like compute-heavy schedule optimization.

---

## 24. Future enhancements roadmap

* Full Gemini-powered advanced scheduler with constraint solver (soft/hard constraints).
* Visual timetable editor in frontend (drag & drop) with conflict detection.
* Calendar sync with Google Calendar / Outlook.
* Multi-tenant support (support multiple institutions).
* Analytics dashboard (attendance, notification stats, schedule conflicts over time).

---

## 25. Appendix

### A. Sample Gemini prompt template

```
You are an assistant that generates a weekly timetable respecting constraints.
Input:
- classes: <JSON array of classes with duration, faculty, room preferences>
- constraints: {"maxConsecutive":2, "labDays":["Wed"], "facultyAvailability":{...}}
Output: JSON array of objects: {"classId":"...","suggestedSlot":"Day X - Slot Y", "notes":"..."}
```

### B. .env example (do NOT commit)

```
FIREBASE_ADMIN_SDK_JSON={"type":"service_account", "project_id":"...", ...}
FIREBASE_DATABASE_URL=https://project-id.firebaseio.com
GEMINI_API_KEY=sk-...
GEMINI_API_URL=https://api.your-gemini-provider/v1/generate
PORT=8080
```

### C. GitHub Actions snippet (already added in repo)

See `.github/workflows/deploy-to-render.yml` — the workflow triggers a Render deploy via API when pushing to `main`.

### D. License & credits

* Author: HexaTech Minds and contributors
* Libraries: three.js (MIT), lottie-web (BSD-like), Firebase (terms apply), Express (MIT)

---

## Contact / Support

If you want, I can:

* Split this monolithic documentation into separate PDF files: `README`, `API_REFERENCE`, `DEPLOYMENT`, `ADMIN_MANUAL`.
* Generate a presentation slide deck from these doc sections for SIH (PDF/PPTX).
* Integrate the frontend with the backend more tightly (wiring calls into your UI) and create a live demo link.

---


=======
full contents of README.md
>>>>>>> e1c74cc (First Commit)
>>>>>>> ac3a85e (First Commit)
