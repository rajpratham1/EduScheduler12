import { motion } from 'framer-motion'
import { useAuth } from '@/store/auth'

export default function Register() {
  const { loginWithGoogle } = useAuth()
  return (
    <div className="min-h-screen grid place-items-center">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur border border-neutral-200 dark:border-neutral-800 max-w-sm w-full shadow-xl">
        <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Use Google, must be a verified Gmail</p>
        <button onClick={loginWithGoogle} className="w-full py-3 rounded-lg bg-brand text-white hover:bg-brand-dark transition">Sign up with Google</button>
      </motion.div>
    </div>
  )
}

