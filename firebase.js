// Frontend Firebase placeholder
// Replace the config object below with your Firebase project's config from Firebase Console -> Project settings -> SDK setup
const firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "<PROJECT>.firebaseapp.com",
  projectId: "<PROJECT_ID>",
  storageBucket: "<PROJECT>.appspot.com",
  messagingSenderId: "<SENDER_ID>",
  appId: "<APP_ID>"
};

// Minimal helper to send schedule data to backend or Firebase directly
async function postSchedule(schedule) {
  // Try backend first
  try {
    const res = await fetch('/api/schedules', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(schedule)
    });
    return await res.json();
  } catch (e) {
    console.warn('Backend not available, consider using Firebase client SDK.');
  }
}
