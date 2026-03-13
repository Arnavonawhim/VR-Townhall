import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cache-Control": "no-cache",
    }
  },
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.endsWith(".data") || req.url.endsWith(".wasm") || req.url.endsWith(".symbols.json")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      }
      next();
    });
  }
})