import { createApp, syncConfigWithLocationHash } from "@harmonizer/core";

createApp(
  document.querySelector("#root"),
  {
    config: syncConfigWithLocationHash(),
    lockColorSpace: false,
  },
  { precalculateColors: true },
);
