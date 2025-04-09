import { createApp } from "@harmonizer/core";
import { defaultConfig } from "@harmonizer/core/src/defaultConfig";

createApp(
  document.querySelector("#root"),
  {
    config: defaultConfig,
    lockColorSpace: false,
  },
  { precalculateColors: true },
);
