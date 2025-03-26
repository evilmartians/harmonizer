import defaultConfig from "@core/defaultConfig.json";
import { parseExportConfig } from "@core/schemas/exportConfig";
import { createApp } from "@harmonizer/core";
import { FigmaPluginActions } from "@ui/components/FigmaPluginActions/FigmaPluginActions";
import { pluginChannel } from "@ui/pluginChannel";

pluginChannel.on("ready", ({ paletteConfig, inP3 }) => {
  const palettePresents = !!paletteConfig;
  const config = palettePresents ? parseExportConfig(paletteConfig) : defaultConfig;

  config.settings.colorSpace = inP3 ? "p3" : "srgb";

  createApp(document.querySelector("#root"), {
    config,
    lockColorSpace: true,
    actions: <FigmaPluginActions isUpdate={palettePresents} />,
  });
});
