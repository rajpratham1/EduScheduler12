// server.js (ESM version)

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Serve static files from frontend build (dist/)
app.use(express.static(path.join(__dirname, "dist")));

// Example API endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from EduScheduler backend!" });
});

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
