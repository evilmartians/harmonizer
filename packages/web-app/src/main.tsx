import { createApp, syncConfigWithLocationHash } from "@harmonizer/core";
import { WebAppActions } from "src/components/WebAppActions";

createApp(
  document.querySelector("#root"),
  {
    config: syncConfigWithLocationHash(),
    lockColorSpace: false,
    actions: <WebAppActions />,
  },
  { precalculateColors: true },
);
