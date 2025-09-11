(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/EduScheduler/frontend/src/pages/admin/AdminDashboard.tsx b/EduScheduler/frontend/src/pages/admin/AdminDashboard.tsx
--- a/EduScheduler/frontend/src/pages/admin/AdminDashboard.tsx
+++ b/EduScheduler/frontend/src/pages/admin/AdminDashboard.tsx
@@ -0,0 +1,29 @@
+import { Link } from 'react-router-dom'
+import { useEffect, useState } from 'react'
+import api from '@/api/client'
+
+export default function AdminDashboard() {
+  const [settings, setSettings] = useState<any>({})
+  const [email, setEmail] = useState('')
+  useEffect(()=>{ (async()=>{ const {data}=await api.get('/settings'); setSettings(data); setEmail(data.adminFeedbackEmail||'') })() },[])
+  const save = async () => { await api.put('/settings', { ...settings, adminFeedbackEmail: email }); alert('Settings saved') }
+  return (
+    <div className="p-6">
+      <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
+      <div className="grid gap-4 mb-8">
+        <Link to="/admin/timetable" className="px-4 py-3 rounded bg-brand text-white w-fit">Timetable Editor</Link>
+        <Link to="/profile" className="px-4 py-3 rounded bg-neutral-200 dark:bg-neutral-800 w-fit">Profile</Link>
+      </div>
+      <div className="max-w-xl">
+        <h3 className="font-medium mb-2">Feedback Destination Email</h3>
+        <div className="flex gap-2">
+          <input value={email} onChange={e=>setEmail(e.target.value)} className="flex-1 px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800" placeholder="admin@college.edu" />
+          <button onClick={save} className="px-3 py-2 rounded bg-brand text-white">Save</button>
+        </div>
+        <p className="text-xs text-neutral-500 mt-2">Faculty and student feedback will be emailed here.</p>
+      </div>
+    </div>
+  )
+}
+
+
EOF
)
