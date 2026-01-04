import { createApp, getDefaultConfigCopy, ColorSpace, parseExportConfig } from "@harmonizer/core";
import { FigmaPluginActions } from "@ui/components/FigmaPluginActions/FigmaPluginActions";
import { pluginChannel } from "@ui/pluginChannel";

import { ResizeWindowHandle } from "./components/ResizeWindowHandle/ResizeWindowHandle";

pluginChannel.on("ready", async ({ storedConfig, inP3 }) => {
  const hasPalette = !!storedConfig;
  const appConfig = await (async () => {
    try {
      if (hasPalette) {
        return await parseExportConfig(storedConfig);
      }
    } catch {
      // Ignore error and use default config
    }

    return await parseExportConfig(getDefaultConfigCopy());
  })();

  appConfig.settings.colorSpace = ColorSpace(inP3 ? "p3" : "srgb");

  createApp(
    document.querySelector("#root"),
    {
      config: appConfig,
      lockColorSpace: true,
    },
    {
      customUI: {
        actions: <FigmaPluginActions hasPalette={hasPalette} />,
        afterGridContent: (
          <ResizeWindowHandle onResize={(size) => pluginChannel.emit("window:resize", size)} />
        ),
      },
    },
  );
});
