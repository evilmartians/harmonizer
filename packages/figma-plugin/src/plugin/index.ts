import { uiChannel } from "@plugin/uiChannel";
import { isDocumentInP3 } from "@plugin/utils/color";
import { drawPalette, getExistingPaletteConfig } from "@plugin/utils/palette";
import { upsertPaletteVariablesCollection } from "@plugin/utils/variables";

figma.showUI(__html__, { width: 1200, height: 900 });

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
