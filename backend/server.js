import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin if service account provided
let db = null;
if (process.env.FIREBASE_ADMIN_SDK_JSON) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || undefined
  });
  db = admin.firestore();
  console.log('Firebase Admin initialized.');
} else {
  console.warn('FIREBASE_ADMIN_SDK_JSON not provided; Firebase Admin not initialized. Some endpoints will fail locally.');
}

// Simple token verification middleware (expects Firebase ID token)
async function verifyToken(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = (auth.startsWith('Bearer ') ? auth.split(' ')[1] : null);
  if (!token) return res.status(401).json({ error: 'Missing Authorization Bearer token' });
  if (!admin.apps.length) return res.status(500).json({ error: 'Admin SDK not initialized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (e) {
    console.error('Token verify error', e);
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Basic classes endpoints
app.get('/api/classes', async (req, res) => {
  try {
    if (!db) return res.status(500).json({error:'Firestore not initialized'});
    const snap = await db.collection('classes').orderBy('createdAt','desc').limit(200).get();
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(list);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/classes', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(500).json({error:'Firestore not initialized'});
    const data = req.body;
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    data.createdBy = req.user.uid;
    const ref = await db.collection('classes').add(data);
    res.json({ id: ref.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Feedback endpoint
app.post('/api/feedback', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(500).json({error:'Firestore not initialized'});
    const data = req.body;
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    data.createdBy = req.user.uid;
    const ref = await db.collection('feedback').add(data);
    res.json({ id: ref.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Register device token for FCM
app.post('/api/register-token', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(500).json({error:'Firestore not initialized'});
    const { token, platform } = req.body;
    if (!token) return res.status(400).json({ error: 'token is required' });
    const docRef = db.collection('deviceTokens').doc(req.user.uid);
    await docRef.set({ token, platform, updatedAt: admin.firestore.FieldValue.serverTimestamp(), uid: req.user.uid });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: send notification via FCM to a specific user or topic
app.post('/api/notifications/send', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(500).json({error:'Firestore not initialized'});
    const claims = req.user || {};
    if (!claims.admin) return res.status(403).json({ error: 'Admin only' });
    const { title, body, targetUid, topic } = req.body;
    let message = null;
    if (targetUid) {
      const doc = await db.collection('deviceTokens').doc(targetUid).get();
      if (!doc.exists) return res.status(404).json({ error: 'Target device token not found' });
      const token = doc.data().token;
      message = { token, notification: { title, body }, data: { from: 'admin' } };
    } else if (topic) {
      message = { topic, notification: { title, body }, data: { from: 'admin' } };
    } else {
      return res.status(400).json({ error: 'targetUid or topic required' });
    }
    const resp = await admin.messaging().send(message);
    // store in firestore
    await db.collection('notifications').add({ title, body, createdAt: admin.firestore.FieldValue.serverTimestamp(), createdBy: req.user.uid, targetUid: targetUid || null, topic: topic || null, messageId: resp });
    res.json({ result: resp });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

// Gemini integration: generate timetable suggestion
app.post('/api/gemini/suggest-schedule', verifyToken, async (req, res) => {
  try {
    const { classes, constraints } = req.body;
    // Basic validation
    if (!Array.isArray(classes) || classes.length === 0) return res.status(400).json({ error: 'classes array required' });

    // If GEMINI_API_KEY provided, call the Gemini HTTP API (placeholder)
    if (!process.env.GEMINI_API_KEY) {
      // Fallback: return a naive round-robin suggestion
      const suggestion = classes.map((c, i) => ({ ...c, suggestedSlot: `Day ${((i % 5) + 1)} - Slot ${((i % 8) + 1)}` }));
      return res.json({ source: 'naive', suggestion });
    }

    // Prepare prompt
    const prompt = `You are an assistant that generates a weekly timetable.
Classes: ${JSON.stringify(classes)}
Constraints: ${JSON.stringify(constraints || {})}
Return a JSON array of classes with suggestedSlot fields.`;

    // Call Gemini (example: using a hypothetical HTTP API)
    const apiUrl = process.env.GEMINI_API_URL || 'https://api.example.com/v1/generate';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_tokens: 800 })
    });
    if (!response.ok) {
      const txt = await response.text();
      return res.status(502).json({ error: 'Gemini API error', details: txt });
    }
    const data = await response.json();
    // Attempt to parse returned text for JSON
    let suggestion = data;
    // If the provider returns {text: "..."} style, try to parse
    if (data && data.text) {
      try { suggestion = JSON.parse(data.text); } catch(e) { suggestion = data.text; }
    }
    res.json({ source: 'gemini', raw: data, suggestion });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

// Serve the static frontend build
const frontendDistPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendDistPath));

// Fallback for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log('Server started on',port));
