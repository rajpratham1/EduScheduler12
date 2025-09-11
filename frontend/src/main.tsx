(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/EduScheduler/frontend/src/main.tsx b/EduScheduler/frontend/src/main.tsx
--- a/EduScheduler/frontend/src/main.tsx
+++ b/EduScheduler/frontend/src/main.tsx
@@ -0,0 +1,19 @@
+import React from 'react'
+import ReactDOM from 'react-dom/client'
+import { BrowserRouter } from 'react-router-dom'
+import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
+import App from './App'
+import './styles.css'
+
+const qc = new QueryClient()
+ReactDOM.createRoot(document.getElementById('root')!).render(
+  <React.StrictMode>
+    <QueryClientProvider client={qc}>
+      <BrowserRouter>
+        <App />
+      </BrowserRouter>
+    </QueryClientProvider>
+  </React.StrictMode>
+)
+
+
EOF
)
