import { uiChannel } from "@plugin/uiChannel";
import { isDocumentInP3 } from "@plugin/utils/color";
import { drawPalette, getStoredConfig } from "@plugin/utils/palette";
import { upsertPaletteVariablesCollection } from "@plugin/utils/variables";

import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  getWindowSize,
  MIN_HEIGHT,
  MIN_WIDTH,
  updateWindowSize,
} from "./utils/window";

main();

function main() {
  figma.showUI(__html__, { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT, themeColors: true });
  void getWindowSize().then(updateWindowSize);

  figma.on("run", () => {
    uiChannel.emit("ready", {
      storedConfig: getStoredConfig(),
      inP3: isDocumentInP3(),
    });
  });

  uiChannel.on("palette:generate", async (config) => {
    const variablesCollection = await upsertPaletteVariablesCollection(config);

    await drawPalette(config, variablesCollection);
    figma.closePlugin();
  });

  uiChannel.on("window:resize", ({ width, height }) =>
    updateWindowSize({ width: Math.max(MIN_WIDTH, width), height: Math.max(MIN_HEIGHT, height) }),
  );
}
