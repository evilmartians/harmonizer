import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { Features } from "lightningcss";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react(), tailwindcss(), patchCssModules()],
  css: {
    transformer: "lightningcss",
    lightningcss: {
      exclude: Features.DirSelector,
      cssModules: {
        pattern:
          process.env.NODE_ENV === "production"
            ? "[local]_[content-hash]"
            : "[name]_[local]_[content-hash]",
      },
    },
  },
  build: {
    target: "es2022",
  },
});
