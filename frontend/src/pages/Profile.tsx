(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/EduScheduler/frontend/src/pages/Profile.tsx b/EduScheduler/frontend/src/pages/Profile.tsx
--- a/EduScheduler/frontend/src/pages/Profile.tsx
+++ b/EduScheduler/frontend/src/pages/Profile.tsx
@@ -0,0 +1,52 @@
+import { useEffect, useState } from 'react'
+import api from '@/api/client'
+
+export default function Profile() {
+  const [profile, setProfile] = useState<any>(null)
+  const [saving, setSaving] = useState(false)
+  useEffect(() => { (async () => { const { data } = await api.get('/users/profile'); setProfile(data) })() }, [])
+  if (!profile) return null
+  const save = async () => { setSaving(true); await api.put('/users/profile', { ...profile }); setSaving(false) }
+  return (
+    <div className="p-6 max-w-2xl mx-auto">
+      <h2 className="text-xl font-semibold mb-4">Profile</h2>
+      <div className="grid gap-4">
+        <label className="grid gap-1">
+          <span className="text-sm">Gmail (required)</span>
+          <input disabled value={profile.email} className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800" />
+        </label>
+        <label className="grid gap-1">
+          <span className="text-sm">Display name</span>
+          <input value={profile.displayName||''} onChange={e=>setProfile({...profile, displayName:e.target.value})} className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800" />
+        </label>
+        <div className="grid grid-cols-2 gap-4">
+          <label className="grid gap-1">
+            <span className="text-sm">Department</span>
+            <input value={profile.department||''} onChange={e=>setProfile({...profile, department:e.target.value})} className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800" />
+          </label>
+          <label className="grid gap-1">
+            <span className="text-sm">Role</span>
+            <input disabled value={profile.role} className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800" />
+          </label>
+        </div>
+        <div className="grid grid-cols-3 gap-4">
+          <label className="grid gap-1">
+            <span className="text-sm">Faculty ID</span>
+            <input value={profile.facultyId||''} onChange={e=>setProfile({...profile, facultyId:e.target.value})} className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800" />
+          </label>
+          <label className="grid gap-1">
+            <span className="text-sm">Student ID</span>
+            <input value={profile.studentId||''} onChange={e=>setProfile({...profile, studentId:e.target.value})} className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800" />
+          </label>
+          <label className="grid gap-1">
+            <span className="text-sm">Batch</span>
+            <input value={profile.batch||''} onChange={e=>setProfile({...profile, batch:e.target.value})} className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800" />
+          </label>
+        </div>
+        <button onClick={save} disabled={saving} className="justify-self-start mt-2 px-4 py-2 rounded bg-brand text-white">{saving?'Saving...':'Save'}</button>
+      </div>
+    </div>
+  )
+}
+
+
EOF
)
