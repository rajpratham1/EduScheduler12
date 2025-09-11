(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/EduScheduler/frontend/src/pages/TimetableView.tsx b/EduScheduler/frontend/src/pages/TimetableView.tsx
--- a/EduScheduler/frontend/src/pages/TimetableView.tsx
+++ b/EduScheduler/frontend/src/pages/TimetableView.tsx
@@ -0,0 +1,22 @@
+import { useQuery } from '@tanstack/react-query'
+import api from '@/api/client'
+
+export default function TimetableView() {
+  const { data } = useQuery({ queryKey: ['student-timetable'], queryFn: async () => (await api.get('/student/timetable')).data })
+  if (!data) return null
+  return (
+    <div className="p-6">
+      <h2 className="text-xl font-semibold mb-4">Your Timetable</h2>
+      <div className="grid gap-3">
+        {data.map((tt: any) => (
+          <div key={tt.id} className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
+            <div className="font-medium">{tt.name}</div>
+            <div className="text-sm text-neutral-600 dark:text-neutral-400">{tt.department} {tt.semester||''}</div>
+          </div>
+        ))}
+      </div>
+    </div>
+  )
+}
+
+
EOF
)
