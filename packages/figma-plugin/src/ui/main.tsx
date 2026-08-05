import { createApp, getDefaultConfigCopy, ColorSpace, parseExportConfig } from "@harmonizer/core";

import { FigmaPluginActions } from "@ui/components/FigmaPluginActions/FigmaPluginActions";
import { pluginChannel } from "@ui/pluginChannel";
import { MIN_SUPPORTED_SANDBOX_VERSION } from "@ui/sandboxSupport";

import { ResizeWindowHandle } from "./components/ResizeWindowHandle/ResizeWindowHandle";

async function mountApp(root: HTMLElement, storedConfig: string | null, inP3: boolean) {
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
    root,
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
}

pluginChannel.on("ready", async ({ sandboxVersion, storedConfig, inP3 }) => {
  const root = document.querySelector<HTMLElement>("#root");

  if (!root) {
    return;
  }

  try {
    if (sandboxVersion < MIN_SUPPORTED_SANDBOX_VERSION) {
      root.textContent =
        "Harmonizer needs a newer version of the plugin. Close and reopen it to update.";
    } else {
      await mountApp(root, storedConfig, inP3);
    }
  } catch (error) {
    console.error(error);
    root.textContent = "Harmonizer couldn't start. Close and reopen the plugin.";
  }

  // Every branch above leaves something on screen. The sandbox watches until this arrives and
  // takes the window over with its own error if it never does, so a failure handled here has to
  // report itself exactly as a successful mount does.
  pluginChannel.emit("ui:mounted");
});

// Announced only after the handler above is registered. The sandbox replies on demand instead
// of pushing on `run`, which would fire before this remotely-loaded bundle has finished parsing.
pluginChannel.emit("ui:ready");
