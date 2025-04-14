import { createApp, getDefaultConfigCopy, ColorSpace, parseExportConfig } from "@harmonizer/core";
import { FigmaPluginActions } from "@ui/components/FigmaPluginActions/FigmaPluginActions";
import { pluginChannel } from "@ui/pluginChannel";

import { ResizeWindowHandle } from "./components/ResizeWindowHandle/ResizeWindowHandle";

pluginChannel.on("ready", ({ storedConfig, inP3 }) => {
  const palettePresents = !!storedConfig;
  const appConfig = (() => {
    try {
      if (palettePresents) {
        return parseExportConfig(storedConfig);
      }
    } catch {
      // Ignore error and use default config
    }

    return getDefaultConfigCopy();
  })();

  appConfig.settings.colorSpace = ColorSpace(inP3 ? "p3" : "srgb");

  createApp(
    document.querySelector("#root"),
    {
      config: appConfig,
      lockColorSpace: true,
      actions: <FigmaPluginActions isUpdate={palettePresents} />,
    },
    {
      customUI: (
        <ResizeWindowHandle onResize={(size) => pluginChannel.emit("window:resize", size)} />
      ),
    },
  );
});
