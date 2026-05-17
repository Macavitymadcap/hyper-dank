import { defineConfig } from "vite";

export default defineConfig({
  build: {
    manifest: true,
    outDir: "dist/client",
    rollupOptions: {
      input: "src/client/main.ts",
    },
  },
  publicDir: "public",
  server: {
    host: "127.0.0.1",
    port: Number(process.env.VITE_PORT ?? 5173),
    strictPort: true,
  },
});
