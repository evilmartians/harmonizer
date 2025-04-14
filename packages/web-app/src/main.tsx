import { createApp, defaultConfig } from "@harmonizer/core";

createApp(
  document.querySelector("#root"),
  {
    config: defaultConfig,
    lockColorSpace: false,
  },
  { precalculateColors: true },
);
