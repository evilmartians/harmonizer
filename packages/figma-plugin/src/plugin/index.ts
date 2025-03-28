import { uiChannel } from "@plugin/uiChannel";
import { isDocumentInP3 } from "@plugin/utils/color";
import { drawPalette, getExistingPaletteConfig } from "@plugin/utils/palette";
import { upsertPaletteVariablesCollection } from "@plugin/utils/variables";

import { getWindowSize, updateWindowSize } from "./utils/window";

main();

function main() {
  figma.showUI(__html__, { width: 0, height: 0 });
  void getWindowSize().then(updateWindowSize);

  figma.on("run", () => {
    uiChannel.emit("ready", {
      paletteConfig: getExistingPaletteConfig(),
      inP3: isDocumentInP3(),
    });
  });

  uiChannel.on("palette:generate", async (paletteConfig) => {
    const variablesCollection = await upsertPaletteVariablesCollection(paletteConfig);

    void drawPalette(paletteConfig, variablesCollection);
  });

  uiChannel.on("window:resize", updateWindowSize);
}
