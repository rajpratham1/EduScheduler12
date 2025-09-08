# System Architecture

## Layers
1. **Frontend**
   - React + Vite project
   - Components: Admin, Faculty, Student dashboards
   - 3D visualizations (Three.js, Lottie)

2. **Backend**
   - Node.js (Express)
   - Firebase Admin SDK
   - REST API endpoints for classes, timetables, notifications

3. **Database**
   - Firebase Firestore for persistent storage

4. **AI Integration**
   - Gemini API for timetable generation

5. **Deployment**
   - Backend deployed on Render
   - CI/CD via GitHub Actions
   - Frontend deployable on Vercel/Netlify

---
