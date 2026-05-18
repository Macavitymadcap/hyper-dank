import { defineConfig } from "vite";

const base = process.env.PACE_DEMO_BASE ?? "/pace/";

export default defineConfig({
  base,
  root: "static-demo",
  build: {
    emptyOutDir: true,
    outDir: "../dist/static-demo",
    rollupOptions: {
      input: "index.html",
    },
  },
  publicDir: false,
  server: {
    host: "127.0.0.1",
    port: Number(process.env.PACE_DEMO_PORT ?? 5174),
    strictPort: true,
  },
});
