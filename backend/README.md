EduScheduler Backend
--------------------

This is a simple Node/Express backend included as a starting point.

To enable Firebase Firestore:
1. Create a Firebase project at https://console.firebase.google.com/
2. Create a service account and download the JSON file.
3. Place the JSON file at backend/serviceAccountKey.json
4. Set the databaseURL in server.js (replace <YOUR_FIREBASE_PROJECT>).
5. Run:
   cd backend
   npm install
   npm start

If Firebase is not configured, the server will use an in-memory store.
