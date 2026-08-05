import { shellHtml, startupErrorHtml } from "@plugin/shell";
import { uiChannel } from "@plugin/uiChannel";
import { isDocumentInP3 } from "@plugin/utils/color";
import { drawPalette, getStoredConfig } from "@plugin/utils/palette";
import { upsertPaletteVariablesCollection } from "@plugin/utils/variables";
import { SANDBOX_BUILD, SANDBOX_VERSION } from "@plugin/version";
import { checkPaletteGenerateData } from "@shared/wireContract";

import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  getWindowSize,
  MIN_HEIGHT,
  MIN_WIDTH,
  updateWindowSize,
} from "./utils/window";

/**
 * Generous on purpose. The shell allows 8 seconds just to reach the UI, and the bundle still has
 * to arrive and mount after that. Cutting off a slow but working load is worse than a longer wait.
 */
const STARTUP_TIMEOUT_MS = 30_000;

main();

function main() {
  figma.showUI(shellHtml, { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT, themeColors: true });
  void getWindowSize().then(updateWindowSize);

  // Everything past the shell's handoff is invisible from here: a wrong page served, a bundle
  // that throws, a message Figma drops. None of it reaches the sandbox, so without this the
  // window sits blank with nothing to explain why. Replaces the shell's own error screen if that
  // one is showing, which is a fair trade for covering the silent cases.
  const startupTimer = setTimeout(() => {
    figma.showUI(startupErrorHtml, {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      themeColors: true,
    });
  }, STARTUP_TIMEOUT_MS);

  // Sent once the bundle has parsed and can receive, which is only the point where state can be
  // pushed at all. Pushing on `run` instead would race the network load and normally lose,
  // leaving an empty window.
  uiChannel.on("ui:ready", () => {
    uiChannel.emit("ready", {
      sandboxVersion: SANDBOX_VERSION,
      sandboxBuild: SANDBOX_BUILD,
      storedConfig: getStoredConfig(),
      inP3: isDocumentInP3(),
    });
  });

  // The handshake only proves the bundle loaded; everything that can still fail -- parsing the
  // stored config, mounting React -- happens after it. Watching until the UI reports something
  // on screen is what keeps a failure there from ending as a blank window.
  uiChannel.on("ui:mounted", () => clearTimeout(startupTimer));

  // The UI is deployed apart from this sandbox, so its payload is untrusted input however well
  // it type checks in one tree. Drawing starts only once the whole payload is known good:
  // variables and nodes are written in sequence, and a failure partway leaves the document
  // holding half a palette.
  uiChannel.on("palette:generate", async (payload) => {
    const check = checkPaletteGenerateData(payload, SANDBOX_VERSION);

    if (check.status !== "supported") {
      figma.notify(
        check.status === "unsupported-sandbox"
          ? "This palette needs a newer Harmonizer. Update the plugin, then try again."
          : "Harmonizer could not read the palette data, so nothing was changed.",
        { error: true },
      );
      return;
    }

    const variablesCollection = await upsertPaletteVariablesCollection(check.data);

    await drawPalette(check.data, variablesCollection);
    figma.closePlugin();
  });

  uiChannel.on("window:resize", ({ width, height }) =>
    updateWindowSize({ width: Math.max(MIN_WIDTH, width), height: Math.max(MIN_HEIGHT, height) }),
  );
}
