import { motion } from 'framer-motion'
import { useAuth } from '@/store/auth'

export default function Login() {
  const { loginWithGoogle } = useAuth()
  return (
    <div className="min-h-screen grid place-items-center relative overflow-hidden">
      <motion.div className="pointer-events-none absolute inset-0 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand/20 blur-3xl" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur border border-neutral-200 dark:border-neutral-800 max-w-sm w-full shadow-xl">
        <h1 className="text-2xl font-semibold mb-2">EduScheduler</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Sign in with verified Gmail via Google</p>
        <button onClick={loginWithGoogle} className="w-full py-3 rounded-lg bg-brand text-white hover:bg-brand-dark transition">Continue with Google</button>
      </motion.div>
    </div>
  )
}

