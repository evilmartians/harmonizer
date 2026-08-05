import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Supplied by the plugin and UI builds; the modules read them at import time.
  define: {
    __UI_URL__: JSON.stringify("https://harmonizer.test/plugin/index.html"),
    __SANDBOX_BUILD__: JSON.stringify("test"),
    __PLUGIN_ID__: JSON.stringify("test-plugin-id"),
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@core": path.resolve(import.meta.dirname, "../core/src"),
      "@plugin": path.resolve(import.meta.dirname, "./src/plugin"),
      "@shared": path.resolve(import.meta.dirname, "./src/shared"),
      "@ui": path.resolve(import.meta.dirname, "./src/ui"),
    },
  },
});
