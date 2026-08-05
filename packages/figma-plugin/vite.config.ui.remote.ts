import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import browserslist from "browserslist";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { Features, browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules";

import figmaManifest from "./figma.manifest.ts";

const browserslistConfig = browserslist(undefined, { config: "./.browserslistrc" });

// Figma embeds this page, so it has to be framable by Figma specifically. Production sets the
// same header in firebase.json; without it the plugin window renders blank with no error.
const FIGMA_FRAME_ANCESTORS = "frame-ancestors https://www.figma.com https://figma.com";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), patchCssModules()],
  define: {
    // Taken from the manifest so the two cannot drift. Every message the UI posts has to carry
    // it, because this page is served from another origin than the plugin iframe.
    __PLUGIN_ID__: JSON.stringify(figmaManifest.id),
  },
  resolve: {
    tsconfigPaths: true,
  },
  root: "./src/ui",
  // Served from https://harmonizer.evilmartians.com/plugin/, not the domain root.
  base: "/plugin/",
  server: {
    // 5173 is the web app's dev server; the two are often run together.
    port: 5174,
    strictPort: true,
    cors: true,
    headers: {
      "Content-Security-Policy": FIGMA_FRAME_ANCESTORS,
    },
  },
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
    // Deployed as part of the web app's Firebase bundle. The web build must run first: it
    // empties web-app/dist and would wipe this directory if the order were reversed.
    outDir: path.resolve(import.meta.dirname, "../web-app/dist/plugin"),
    emptyOutDir: true,
    rolldownOptions: {
      input: path.resolve(import.meta.dirname, "src/ui/index.html"),
    },
  },
  worker: {},
}));
