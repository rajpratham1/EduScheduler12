
+import { useEffect, useState } from 'react'
+
+export default function ThemeToggle() {
+  const [dark, setDark] = useState<boolean>(() => localStorage.theme === 'dark')
+  useEffect(() => {
+    if (dark) { document.documentElement.classList.add('dark'); localStorage.theme = 'dark' }
+    else { document.documentElement.classList.remove('dark'); localStorage.theme = 'light' }
+  }, [dark])
+  return (
+    <button onClick={() => setDark((d) => !d)} className="px-3 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:opacity-90" aria-label="Toggle theme">
+      {dark ? 'Night' : 'Light'}
+    </button>
+  )
+}
+
+
EOF
)
