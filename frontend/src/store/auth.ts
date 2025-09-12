
+import { create } from 'zustand'
+import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth'
+import { auth, googleProvider } from '@/firebase'
+import api from '@/api/client'
+
+type Role = 'admin' | 'faculty' | 'student'
+type AuthState = {
+  user: User | null
+  role: Role | null
+  loading: boolean
+  init: () => void
+  loginWithGoogle: () => Promise<void>
+  logout: () => Promise<void>
+}
+
+export const useAuth = create<AuthState>((set) => ({
+  user: null,
+  role: null,
+  loading: true,
+  init: () => {
+    onAuthStateChanged(auth, async (u) => {
+      if (u) {
+        const { data } = await api.get('/auth/me')
+        set({ user: u, role: data.role as Role, loading: false })
+      } else {
+        set({ user: null, role: null, loading: false })
+      }
+    })
+  },
+  loginWithGoogle: async () => { await signInWithPopup(auth, googleProvider) },
+  logout: async () => { await signOut(auth) }
+}))
+
+
EOF
)
