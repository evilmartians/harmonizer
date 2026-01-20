import { createApp, syncConfigWithLocationHash } from "@harmonizer/core";
import {
  $isBannerClosed,
  FigmaPluginBanner,
} from "src/components/FigmaPluginBanner/FigmaPluginBanner";
import { WebAppActions } from "src/components/WebAppActions/WebAppActions";

import "./plausible";

async function main() {
  const config = await syncConfigWithLocationHash();

  createApp(
    document.querySelector("#root"),
    {
      config,
      lockColorSpace: false,
    },
    {
      precalculateColors: true,
      customUI: {
        gridBanner: {
          $isClosed: $isBannerClosed,
          component: <FigmaPluginBanner />,
        },
        actions: <WebAppActions />,
      },
    },
  );
}

void main();
