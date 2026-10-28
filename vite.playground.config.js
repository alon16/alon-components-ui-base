import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  root: fileURLToPath(new URL("./playground", import.meta.url)),
  // GitHub Pages sirve el sitio bajo /<repositorio>/; en local se mantiene la raíz.
  base: process.env.PLAYGROUND_BASE ?? "/",
  plugins: [vue()],
  build: {
    outDir: fileURLToPath(new URL("./dist-playground", import.meta.url)),
    emptyOutDir: true,
  },
});
