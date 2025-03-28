import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules";
import { viteSingleFile } from "vite-plugin-singlefile";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [tsconfigPaths(), react(), tailwindcss(), patchCssModules(), viteSingleFile()],
  root: "./src/ui",
  build: {
    target: "esnext",
    minify: mode === "production",
    cssMinify: mode === "production",
    sourcemap: mode === "production" ? false : "inline",
    emptyOutDir: false,
    outDir: path.resolve(__dirname, "dist"),
    rollupOptions: {
      input: path.resolve(__dirname, "src/ui/index.html"),
    },
  },
  worker: {
    plugins: () => [tsconfigPaths()],
  },
}));
