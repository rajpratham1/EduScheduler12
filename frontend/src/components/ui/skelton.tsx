(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/EduScheduler/frontend/src/components/ui/Skeleton.tsx b/EduScheduler/frontend/src/components/ui/Skeleton.tsx
--- a/EduScheduler/frontend/src/components/ui/Skeleton.tsx
+++ b/EduScheduler/frontend/src/components/ui/Skeleton.tsx
@@ -0,0 +1,5 @@
+import { clsx } from 'clsx'
+
+export function Skeleton({ className }: { className?: string }) {
+	return <div className={clsx('animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded', className)} />
+}
EOF
)
