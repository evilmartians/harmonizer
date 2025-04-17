import { createApp, syncConfigWithLocationHash } from "@harmonizer/core";
import { CopyUrlAction } from "src/components/CopyUrlAction";

createApp(
  document.querySelector("#root"),
  {
    config: syncConfigWithLocationHash(),
    lockColorSpace: false,
    actions: <CopyUrlAction />,
  },
  { precalculateColors: true },
);
