/**
 * Express backend for EduScheduler
 * - Provides REST endpoints for schedules, reviews, and settings
 * - Uses Firebase Admin SDK if service account is present
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin if service account exists
const serviceAccountPath = new URL('./serviceAccountKey.json', import.meta.url).pathname;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
  console.log('✅ Firebase Admin initialized.');
} else {
  console.log('⚠️ Warning: Firebase service account key not found. Create backend/serviceAccountKey.json to enable Firebase.');
}

// Example in-memory store (fallback if Firebase not configured)
let schedules = [];

// ================== ROUTES ==================

// GET schedules
app.get('/api/schedules', async (req, res) => {
  if (admin.apps.length) {
    try {
      const db = admin.firestore();
      const snap = await db.collection('schedules').get();
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return res.json(data);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Firebase error' });
    }
  }
  res.json(schedules);
});

// POST schedule
app.post('/api/schedules', async (req, res) => {
  const payload = req.body;
  if (admin.apps.length) {
    try {
      const db = admin.firestore();
      const doc = await db.collection('schedules').add(payload);
      return res.json({ id: doc.id });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Firebase error' });
    }
  }
  payload.id = schedules.length + 1;
  schedules.push(payload);
  res.json({ id: payload.id });
});

// POST review
app.post('/api/review', async (req, res) => {
  const payload = req.body || {};
  if (admin.apps.length) {
    try {
      const db = admin.firestore();
      const doc = await db.collection('reviews').add({
        ...payload,
        status: 'pending',
        createdAt: Date.now()
      });

      // Forward to Formspree (optional)
      const formspreeToken = process.env.FORMSPREE_TOKEN || 'xvgrnpyb';
      const formspreeEndpoint = `https://formspree.io/${formspreeToken}`;

      try {
        await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: payload.reviewerEmail || 'noreply@example.com',
            message: payload.message || '',
            itemId: payload.itemId || '',
            type: payload.type || ''
          })
        });
      } catch (e) {
        console.warn('⚠️ Formspree forward failed:', e.message || e);
      }

      return res.json({ id: doc.id });
    } catch (e) {
      console.error('❌ Firestore review save failed', e);
      return res.status(500).json({ error: 'Firestore error' });
    }
  } else {
    return res.json({ id: Date.now() });
  }
});

// Update schedule_config
app.post('/api/settings/schedule_config', async (req, res) => {
  const { days, times } = req.body || {};
  if (!Array.isArray(days) || !Array.isArray(times)) {
    return res.status(400).json({ error: 'days and times arrays required' });
  }

  if (admin.apps.length) {
    try {
      const db = admin.firestore();
      const ref = db.collection('settings').doc('schedule_config');
      await ref.set({ days, times }, { merge: true });
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'Firestore error' });
    }
  } else {
    return res.json({ ok: true, note: 'Firestore not configured' });
  }
});

// ============================================

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
