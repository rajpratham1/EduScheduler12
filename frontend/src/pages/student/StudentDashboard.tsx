
+import { useState } from 'react'
+import api from '@/api/client'
+import TimetableView from '@/pages/TimetableView'
+
+export default function StudentDashboard() {
+  const [subject, setSubject] = useState('Feedback from Student')
+  const [message, setMessage] = useState('')
+  const send = async () => { await api.post('/feedback/student', { subject, message }); setMessage(''); alert('Sent') }
+  return (
+    <div>
+      <div className="p-6">
+        <h2 className="text-xl font-semibold mb-2">Student Dashboard</h2>
+        <div className="grid md:grid-cols-2 gap-4">
+          <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
+            <h3 className="font-medium mb-2">Send Feedback</h3>
+            <input value={subject} onChange={e=>setSubject(e.target.value)} className="mb-2 w-full px-3 py-2 rounded bg-neutral-200 dark:bg-neutral-800" />
+            <textarea value={message} onChange={e=>setMessage(e.target.value)} className="w-full h-28 px-3 py-2 rounded bg-neutral-200 dark:bg-neutral-800" />
+            <button onClick={send} className="mt-2 px-3 py-2 rounded bg-brand text-white">Send</button>
+          </div>
+        </div>
+      </div>
+      <TimetableView />
+    </div>
+  )
+}
+
+
EOF
)
