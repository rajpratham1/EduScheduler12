(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/EduScheduler/frontend/vite.config.ts b/EduScheduler/frontend/vite.config.ts
--- a/EduScheduler/frontend/vite.config.ts
+++ b/EduScheduler/frontend/vite.config.ts
@@ -0,0 +1,15 @@
+import { defineConfig } from 'vite'
+import path from 'node:path'
+import react from '@vitejs/plugin-react'
+
+export default defineConfig({
+  plugins: [react()],
+  server: { port: 5173, host: true },
+  resolve: {
+    alias: {
+      '@': path.resolve(__dirname, 'src')
+    }
+  }
+})
+
+
EOF
)
