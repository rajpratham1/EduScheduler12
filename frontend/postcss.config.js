(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/EduScheduler/frontend/postcss.config.js b/EduScheduler/frontend/postcss.config.js
--- a/EduScheduler/frontend/postcss.config.js
+++ b/EduScheduler/frontend/postcss.config.js
@@ -0,0 +1,8 @@
+export default {
+  plugins: {
+    tailwindcss: {},
+    autoprefixer: {}
+  }
+}
+
+
EOF
)
