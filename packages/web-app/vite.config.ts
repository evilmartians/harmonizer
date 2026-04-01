import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import browserslist from "browserslist";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { Features, browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules";

const browserslistConfig = browserslist(undefined, { config: "./.browserslistrc" });

export default defineConfig({
  plugins: [react(), tailwindcss(), patchCssModules()],
  resolve: {
    tsconfigPaths: true,
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
  worker: {},
  build: {
    target: browserslistToEsbuild(browserslistConfig),
    chunkSizeWarningLimit: 600,
  },
});
