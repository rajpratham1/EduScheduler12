(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/EduScheduler/frontend/src/api/client.ts b/EduScheduler/frontend/src/api/client.ts
--- a/EduScheduler/frontend/src/api/client.ts
+++ b/EduScheduler/frontend/src/api/client.ts
@@ -0,0 +1,16 @@
+import axios from 'axios'
+import { auth } from '@/firebase'
+
+const api = axios.create({
+  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
+})
+
+api.interceptors.request.use(async (config) => {
+  const token = await auth.currentUser?.getIdToken()
+  if (token) config.headers.Authorization = `Bearer ${token}`
+  return config
+})
+
+export default api
+
+
EOF
)
