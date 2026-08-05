import { execSync } from "node:child_process";
import path from "node:path";

import { defineConfig } from "vite";
import generateFile from "vite-plugin-generate-file";

import figmaManifest from "./figma.manifest.ts";

// Spelled out to index.html rather than the directory. This URL is frozen at publish time, and
// Firebase matches header rules against the request path, so "/plugin/" would miss the
// no-store rule meant for the shell and inherit the default one-hour cache instead.
const UI_DEV_URL = "http://localhost:5174/plugin/index.html";
const UI_PROD_URL = "https://harmonizer.evilmartians.com/plugin/index.html";

/**
 * Points a development build at an already deployed UI, such as a PR preview channel, so the
 * hosted page can be checked inside Figma before it reaches `main`. Set by `pnpm figma:preview`,
 * which is the way to use this.
 *
 * Production builds ignore it on purpose: the URL a published plugin points at cannot be fixed
 * afterwards, so a stray value in someone's shell must never be able to reach one.
 */
function getPreviewOrigin(mode: string) {
  if (mode === "production") {
    return undefined;
  }

  return process.env.HARMONIZER_UI_ORIGIN?.replace(/\/+$/, "") || undefined;
}

// Reported to the UI in the handshake so a support request can be tied to an exact published
// build, which matters more than usual because the sandbox only changes when we republish.
function getBuildSha() {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

export default defineConfig(({ mode }) => {
  const previewOrigin = getPreviewOrigin(mode);

  if (previewOrigin) {
    console.info(`Plugin UI overridden to ${previewOrigin}`);
  }

  return {
    resolve: {
      tsconfigPaths: true,
    },
    define: {
      __UI_URL__: JSON.stringify(
        previewOrigin
          ? `${previewOrigin}/plugin/index.html`
          : mode === "production"
            ? UI_PROD_URL
            : UI_DEV_URL,
      ),
      __SANDBOX_BUILD__: JSON.stringify(getBuildSha()),
    },
    plugins: [
      generateFile({
        type: "json",
        output: "./manifest.json",
        // Figma blocks any host the manifest does not list, so the override has to reach the
        // generated manifest too. figma.manifest.ts stays untouched: it is the published one.
        data: previewOrigin
          ? {
              ...figmaManifest,
              networkAccess: {
                ...figmaManifest.networkAccess,
                devAllowedDomains: [
                  previewOrigin,
                  ...figmaManifest.networkAccess.devAllowedDomains,
                ],
              },
            }
          : figmaManifest,
      }),
    ],
    build: {
      minify: mode === "production",
      sourcemap: mode === "production" ? false : "inline",
      target: "es2017",
      // The sandbox build owns dist/ now that the UI is deployed with the web app, so stale
      // artifacts from the old bundled-UI layout should not survive here.
      emptyOutDir: true,
      outDir: path.resolve(import.meta.dirname, "dist"),
      rolldownOptions: {
        input: path.resolve(import.meta.dirname, "src/plugin/index.ts"),
        output: {
          entryFileNames: "plugin.js",
          // Figma loads exactly one sandbox file, so code splitting must never kick in.
          codeSplitting: false,
        },
      },
    },
  };
});
