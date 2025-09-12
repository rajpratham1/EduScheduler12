
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
