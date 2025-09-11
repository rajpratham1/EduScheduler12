(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/EduScheduler/frontend/tailwind.config.js b/EduScheduler/frontend/tailwind.config.js
--- a/EduScheduler/frontend/tailwind.config.js
+++ b/EduScheduler/frontend/tailwind.config.js
@@ -0,0 +1,15 @@
+/** @type {import('tailwindcss').Config} */
+export default {
+  darkMode: 'class',
+  content: ['./index.html', './src/**/*.{ts,tsx}'],
+  theme: {
+    extend: {
+      colors: {
+        brand: { DEFAULT: '#2563eb', dark: '#1e40af' }
+      }
+    }
+  },
+  plugins: []
+}
+
+
EOF
)
