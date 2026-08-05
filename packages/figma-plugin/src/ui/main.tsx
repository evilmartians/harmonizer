import { createApp, getDefaultConfigCopy, ColorSpace, parseExportConfig } from "@harmonizer/core";

import { FigmaPluginActions } from "@ui/components/FigmaPluginActions/FigmaPluginActions";
import { pluginChannel } from "@ui/pluginChannel";

import { ResizeWindowHandle } from "./components/ResizeWindowHandle/ResizeWindowHandle";

/**
 * Oldest sandbox this UI can still talk to. The UI redeploys on every push while the sandbox
 * only changes when the plugin is republished, so the two drift apart. Raise this when a wire
 * change stops being backwards compatible, and adapt older payloads here rather than in the
 * sandbox, which cannot be patched after publish.
 */
const MIN_SUPPORTED_SANDBOX_VERSION = 1;

pluginChannel.on("ready", async ({ sandboxVersion, storedConfig, inP3 }) => {
  const root = document.querySelector<HTMLElement>("#root");

  if (!root) {
    return;
  }

  if (sandboxVersion < MIN_SUPPORTED_SANDBOX_VERSION) {
    root.textContent =
      "Harmonizer needs a newer version of the plugin. Close and reopen it to update.";
    return;
  }

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
});

// Announced only after the handler above is registered. The sandbox replies on demand instead
// of pushing on `run`, which would fire before this remotely-loaded bundle has finished parsing.
pluginChannel.emit("ui:ready");
