import { createApp, syncConfigWithLocationHash } from "@harmonizer/core";
import {
  $isBannerClosed,
  FigmaPluginBanner,
} from "@web-app/components/FigmaPluginBanner/FigmaPluginBanner";
import { WebAppActions } from "@web-app/components/WebAppActions/WebAppActions";

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
