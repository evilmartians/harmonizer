import path from "node:path";

import { defineConfig } from "vite";
import generateFile from "vite-plugin-generate-file";
import { viteSingleFile } from "vite-plugin-singlefile";
import tsconfigPaths from "vite-tsconfig-paths";

import figmaManifest from "./figma.manifest.ts";

export default defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths(),
    viteSingleFile(),
    generateFile({
      type: "json",
      output: "./manifest.json",
      data: figmaManifest,
    }),
  ],
  build: {
    minify: mode === "production",
    sourcemap: mode === "production" ? false : "inline",
    target: "es2017",
    emptyOutDir: false,
    outDir: path.resolve(__dirname, "dist"),
    rollupOptions: {
      input: path.resolve(__dirname, "src/plugin/index.ts"),
      output: {
        entryFileNames: "plugin.js",
      },
    },
  },
}));
