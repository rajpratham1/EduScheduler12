// App.tsx (updated)
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from './services/firebase.ts';
import { getAnalytics, isSupported } from "firebase/analytics"; // Add this import

// ... your other imports and component code

function App() {
  // ... your state and other hooks

  useEffect(() => {
    // ... your existing onAuthStateChanged logic

    // Add this new code to initialize Analytics
    async function initializeAnalytics() {
        if (await isSupported()) {
            getAnalytics(app); // Call getAnalytics after the app has initialized and is supported
        }
    }
    initializeAnalytics();

    return () => unsubscribe();
  }, []);

  // ... rest of your App component code
}

export default App;
