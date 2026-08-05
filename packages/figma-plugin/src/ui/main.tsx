import { useLayoutEffect } from "react";

import { createApp, getDefaultConfigCopy, ColorSpace, parseExportConfig } from "@harmonizer/core";

import { FigmaPluginActions } from "@ui/components/FigmaPluginActions/FigmaPluginActions";
import { pluginChannel } from "@ui/pluginChannel";
import { MIN_SUPPORTED_SANDBOX_VERSION } from "@ui/sandboxSupport";

import { ResizeWindowHandle } from "./components/ResizeWindowHandle/ResizeWindowHandle";

/**
 * Renders nothing. It exists to run from inside the tree, because `createRoot().render()`
 * returns before React commits: reporting from the caller would report a window that can still
 * end up empty, and a render that throws would clear the watchdog on its way to a blank screen.
 */
function ReportPainted() {
  useLayoutEffect(() => {
    pluginChannel.emit("ui:mounted");
  }, []);

  return null;
}

function showMessage(root: HTMLElement, text: string) {
  root.textContent = text;
  pluginChannel.emit("ui:mounted");
}

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
          <>
            <ResizeWindowHandle onResize={(size) => pluginChannel.emit("window:resize", size)} />
            <ReportPainted />
          </>
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

  if (sandboxVersion < MIN_SUPPORTED_SANDBOX_VERSION) {
    showMessage(
      root,
      "Harmonizer needs a newer version of the plugin. Close and reopen it to update.",
    );
    return;
  }

  // A message screen is as much a painted window as the app is, so it reports itself the same
  // way. Only what leaves the window empty stays silent, and the sandbox replaces that.
  try {
    await mountApp(root, storedConfig, inP3);
  } catch (error) {
    console.error(error);
    showMessage(root, "Harmonizer couldn't start. Close and reopen the plugin.");
  }
});

// Announced only after the handler above is registered. The sandbox replies on demand instead
// of pushing on `run`, which would fire before this remotely-loaded bundle has finished parsing.
pluginChannel.emit("ui:ready");
