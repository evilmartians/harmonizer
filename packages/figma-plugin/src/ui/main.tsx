import { getDefaultConfigCopy } from "@core/defaultConfig";
import { parseExportConfig } from "@core/schemas/exportConfig";
import { ColorSpace } from "@core/types";
import { createApp } from "@harmonizer/core";
import { FigmaPluginActions } from "@ui/components/FigmaPluginActions/FigmaPluginActions";
import { pluginChannel } from "@ui/pluginChannel";

import { ResizeWindowHandle } from "./components/ResizeWindowHandle/ResizeWindowHandle";

pluginChannel.on("ready", ({ paletteConfig, inP3 }) => {
  const palettePresents = !!paletteConfig;
  const config = palettePresents ? parseExportConfig(paletteConfig) : getDefaultConfigCopy();

  config.settings.colorSpace = ColorSpace(inP3 ? "p3" : "srgb");

  createApp(
    document.querySelector("#root"),
    {
      config,
      lockColorSpace: true,
      actions: <FigmaPluginActions isUpdate={palettePresents} />,
    },
    <ResizeWindowHandle onResize={(size) => pluginChannel.emit("window:resize", size)} />,
  );
});
