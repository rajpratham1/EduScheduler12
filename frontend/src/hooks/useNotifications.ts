
+import { useEffect, useRef, useState } from 'react'
+import { auth } from '@/firebase'
+
+export function useNotifications(apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000') {
+	const wsRef = useRef<WebSocket | null>(null)
+	const [lastMessage, setLastMessage] = useState<string | null>(null)
+
+	useEffect(() => {
+		let cancelled = false
+		async function connect() {
+			const token = await auth.currentUser?.getIdToken()
+			if (!token) return
+			const url = apiBase.replace(/^http/, 'ws') + `/ws/notifications?token=${token}`
+			const ws = new WebSocket(url)
+			wsRef.current = ws
+			ws.onmessage = (ev) => { if (!cancelled) setLastMessage(ev.data as string) }
+			ws.onopen = () => { ws.send('ping') }
+			ws.onclose = () => { wsRef.current = null }
+		}
+		connect()
+		return () => { cancelled = true; wsRef.current?.close() }
+	}, [apiBase])
+
+	return { lastMessage }
+}
EOF
)
