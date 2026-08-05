/**
 * Boots the built plugin UI in a real browser with a stubbed sandbox.
 *
 * Deploying the UI is what ships plugin changes to users now, and the published sandbox cannot
 * be patched afterwards, so this stands in for the manual publish step that used to gate
 * releases. It catches the failures that actually happen -- a bundle that throws on load, a
 * broken import, a handshake that never completes -- none of which a build or a typecheck sees.
 *
 * Uses the system Chrome via playwright-core so CI does not download a browser.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

import { chromium } from "playwright-core";

const DIST = path.resolve("packages/web-app/dist");
const PORT = 4178;
const PAGE_URL = `http://localhost:${PORT}/plugin/index.html`;
const MOUNT_TIMEOUT_MS = 15_000;

const MIME_TYPES = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function serveDist() {
  const server = createServer((request, response) => {
    const requested = decodeURIComponent(new URL(request.url, PAGE_URL).pathname);
    const filePath = path.join(DIST, requested);

    if (!filePath.startsWith(DIST)) {
      response.writeHead(403).end();
      return;
    }

    stat(filePath)
      .then((stats) => {
        if (!stats.isFile()) {
          throw new Error("not a file");
        }

        response.writeHead(200, {
          "Content-Type": MIME_TYPES[path.extname(filePath)] ?? "application/octet-stream",
        });
        createReadStream(filePath).pipe(response);
      })
      .catch(() => response.writeHead(404).end());
  });

  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

/**
 * Stands in for the Figma sandbox. The UI posts to `parent`, which is the window itself in a
 * top-level page, so listening here receives it and posting back reaches the UI's `onmessage`.
 *
 * Drops messages carrying no pluginId, exactly as Figma does for a UI served from another
 * origin. Without that rule this stub is more forgiving than the real thing and would pass a
 * build that hangs on a blank window in Figma.
 */
function stubSandbox() {
  window.addEventListener("message", (event) => {
    if (event.data?.pluginMessage?.type !== "ui:ready") {
      return;
    }

    if (!event.data.pluginId) {
      console.error("message posted without pluginId: Figma would drop it");
      return;
    }

    window.postMessage(
      {
        pluginMessage: {
          type: "ready",
          payload: {
            sandboxVersion: 1,
            sandboxBuild: "smoke",
            storedConfig: null,
            inP3: false,
          },
        },
      },
      "*",
    );
  });
}

async function main() {
  const server = await serveDist();
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage();
  const failures = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      failures.push(`console: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));

  try {
    await page.addInitScript(stubSandbox);
    await page.goto(PAGE_URL, { waitUntil: "load" });
    await page.waitForFunction(() => document.querySelector("#root")?.childElementCount > 0, null, {
      timeout: MOUNT_TIMEOUT_MS,
    });
  } catch {
    failures.push("plugin UI did not mount: the handshake never completed");
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length > 0) {
    console.error("Plugin UI smoke test failed:");
    failures.forEach((failure) => console.error(`  ${failure}`));
    process.exit(1);
  }

  console.log("Plugin UI smoke test passed");
}

await main();
