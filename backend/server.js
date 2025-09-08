/**
 * EduScheduler Backend (ESM)
 * - Serves REST APIs (schedules, reviews, settings)
 * - Serves built React frontend from /dist
 */

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

// ================= Setup =================
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= Firebase Setup =================
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<YOUR_FIREBASE_PROJECT>.firebaseio.com",
  });
  console.log("✅ Firebase Admin initialized.");
} else {
  console.log("⚠️ No serviceAccountKey.json found. Using in-memory storage.");
}

// ================= In-memory fallback =================
let schedules = [];

// ================= API Routes =================

// GET schedules
app.get("/api/schedules", async (req, res) => {
  if (admin.apps.length) {
    try {
      const db = admin.firestore();
      const snap = await db.collection("schedules").get();
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.json(data);
    } catch (e) {
      console.error("❌ Firebase error:", e);
      return res.status(500).json({ error: "Firebase error" });
    }
  }
  res.json(schedules);
});

// POST schedule
app.post("/api/schedules", async (req, res) => {
  const payload = req.body;
  if (admin.apps.length) {
    try {
      const db = admin.firestore();
      const doc = await db.collection("schedules").add(payload);
      return res.json({ id: doc.id });
    } catch (e) {
      console.error("❌ Firebase error:", e);
      return res.status(500).json({ error: "Firebase error" });
    }
  }
  payload.id = schedules.length + 1;
  schedules.push(payload);
  res.json({ id: payload.id });
});

// POST review
app.post("/api/review", async (req, res) => {
  const payload = req.body || {};
  if (admin.apps.length) {
    try {
      const db = admin.firestore();
      const doc = await db
        .collection("reviews")
        .add({ ...payload, status: "pending", createdAt: Date.now() });

      // Forward to Formspree
      const formspreeToken = process.env.FORMSPREE_TOKEN || "xvgrnpyb";
      const formspreeEndpoint = `https://formspree.io/${formspreeToken}`;
      try {
        await fetch(formspreeEndpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: payload.reviewerEmail || "noreply@example.com",
            message: payload.message || "",
            itemId: payload.itemId || "",
            type: payload.type || "",
          }),
        });
      } catch (e) {
        console.warn("⚠️ Formspree forward failed:", e.message || e);
      }

      return res.json({ id: doc.id });
    } catch (e) {
      console.error("❌ Firestore review save failed:", e);
      return res.status(500).json({ error: "Firestore error" });
    }
  } else {
    return res.json({ id: Date.now() });
  }
});

// POST settings
app.post("/api/settings/schedule_config", async (req, res) => {
  const { days, times } = req.body || {};
  if (!Array.isArray(days) || !Array.isArray(times)) {
    return res.status(400).json({ error: "days and times arrays required" });
  }

  if (admin.apps.length) {
    try {
      const db = admin.firestore();
      const ref = db.collection("settings").doc("schedule_config");
      await ref.set({ days, times }, { merge: true });
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: "Firestore error" });
    }
  } else {
    return res.json({ ok: true, note: "Firestore not configured" });
  }
});

// Example simple API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from EduScheduler backend!" });
});

// ================= Frontend =================

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, "dist")));

// Fallback for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ================= Start Server =================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
