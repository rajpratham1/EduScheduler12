(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/EduScheduler/frontend/src/pages/Dashboard.tsx b/EduScheduler/frontend/src/pages/Dashboard.tsx
--- a/EduScheduler/frontend/src/pages/Dashboard.tsx
+++ b/EduScheduler/frontend/src/pages/Dashboard.tsx
@@ -0,0 +1,20 @@
+import { useEffect } from 'react'
+import { useAuth } from '@/store/auth'
+import { useNavigate } from 'react-router-dom'
+
+export default function Dashboard() {
+  const { init, loading, user, role } = useAuth()
+  const nav = useNavigate()
+  useEffect(() => { init() }, [init])
+  useEffect(() => {
+    if (!loading) {
+      if (!user) nav('/login')
+      else if (role === 'admin') nav('/admin')
+      else if (role === 'faculty') nav('/faculty')
+      else nav('/student')
+    }
+  }, [loading, user, role, nav])
+  return null
+}
+
+
EOF
)
