import { shellHtml, startupErrorHtml } from "@plugin/shell";
import { uiChannel } from "@plugin/uiChannel";
import { isDocumentInP3 } from "@plugin/utils/color";
import { drawPalette, getStoredConfig } from "@plugin/utils/palette";
import { upsertPaletteVariablesCollection } from "@plugin/utils/variables";
import { SANDBOX_BUILD, SANDBOX_VERSION } from "@plugin/version";

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

  // The UI is fetched over the network, so it announces itself once mounted. Pushing state on
  // `run` instead would race the load and normally lose, leaving an empty window.
  uiChannel.on("ui:ready", () => {
    clearTimeout(startupTimer);

    uiChannel.emit("ready", {
      sandboxVersion: SANDBOX_VERSION,
      sandboxBuild: SANDBOX_BUILD,
      storedConfig: getStoredConfig(),
      inP3: isDocumentInP3(),
    });
  });

  uiChannel.on("palette:generate", async (data) => {
    const variablesCollection = await upsertPaletteVariablesCollection(data);

    await drawPalette(data, variablesCollection);
    figma.closePlugin();
  });

  uiChannel.on("window:resize", ({ width, height }) =>
    updateWindowSize({ width: Math.max(MIN_WIDTH, width), height: Math.max(MIN_HEIGHT, height) }),
  );
}
