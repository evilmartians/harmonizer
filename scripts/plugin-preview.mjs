/**
 * Builds the sandbox against an already deployed plugin UI, usually a PR preview channel, so the
 * hosted page can be checked inside Figma before it reaches main.
 *
 * The origin is a required argument rather than an environment variable on purpose: an exported
 * variable outlives the command that needed it and would quietly redirect later dev builds. It
 * reaches the vite config as HARMONIZER_UI_ORIGIN, set only for this child process.
 */
import { spawn } from "node:child_process";
import path from "node:path";

const PLUGIN_DIR = path.resolve(import.meta.dirname, "../packages/figma-plugin");

function fail(message) {
  console.error(`${message}

Usage: pnpm figma:preview <origin>

  <origin>  Where the plugin UI is deployed. The deploy workflow comments it on the PR.
            Example: https://harmonizer-web--pr71-abc123.web.app`);
  process.exit(1);
}

const input = process.argv[2];

if (!input) {
  fail("Missing the preview origin.");
}

// Takes the origin off whatever was pasted, so a full link to the page works as well.
let origin;

try {
  ({ origin } = new URL(input));
} catch {
  fail(`Not a URL: ${input}. Include the scheme, for example https://...`);
}

if (!origin.startsWith("http")) {
  fail(`Not an http(s) origin: ${origin}`);
}

console.info(`Plugin UI: ${origin}/plugin/index.html`);
console.info("Load packages/figma-plugin/dist/manifest.json in the Figma desktop app.\n");

const child = spawn(
  "pnpm",
  ["vite", "build", "--watch", "--mode=development", "-c", "vite.config.plugin.ts"],
  {
    cwd: PLUGIN_DIR,
    stdio: "inherit",
    env: { ...process.env, HARMONIZER_UI_ORIGIN: origin },
  },
);

child.on("exit", (code, signal) => process.exit(signal ? 1 : (code ?? 1)));
