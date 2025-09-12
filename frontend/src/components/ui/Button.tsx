
+import { motion } from 'framer-motion'
+import { clsx } from 'clsx'
+import { ButtonHTMLAttributes } from 'react'
+
+type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }
+
+export default function Button({ className, children, variant = 'primary', ...rest }: Props) {
+	const base = 'px-4 py-2 rounded inline-flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-offset-2'
+	const styles = variant === 'primary'
+		? 'bg-brand text-white hover:bg-brand-dark focus:ring-brand'
+		: 'bg-neutral-200 dark:bg-neutral-800 hover:opacity-90 focus:ring-neutral-500'
+	return (
+		<motion.button whileTap={{ scale: 0.98 }} whileHover={{ y: -1 }} className={clsx(base, styles, className)} {...rest}>
+			{children}
+		</motion.button>
+	)
+}
EOF
)
