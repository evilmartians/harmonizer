import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import browserslist from "browserslist";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { Features, browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules";
import { viteSingleFile } from "vite-plugin-singlefile";

const browserslistConfig = browserslist(undefined, { config: "./.browserslistrc" });

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), patchCssModules(), viteSingleFile()],
  resolve: {
    tsconfigPaths: true,
  },
  root: "./src/ui",
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: browserslistToTargets(browserslistConfig),
      exclude: Features.DirSelector,
      cssModules: {
        pattern:
          process.env.NODE_ENV === "production"
            ? "[local]_[content-hash]"
            : "[name]_[local]_[content-hash]",
      },
      drafts: {
        customMedia: true,
      },
    },
  },
  build: {
    target: browserslistToEsbuild(browserslistConfig),
    minify: mode === "production",
    cssMinify: mode === "production",
    sourcemap: mode === "production" ? false : "inline",
    emptyOutDir: false,
    outDir: path.resolve(__dirname, "dist"),
    rollupOptions: {
      input: path.resolve(__dirname, "src/ui/index.html"),
    },
  },
  worker: {},
}));
