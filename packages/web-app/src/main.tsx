import { createApp } from "@harmonizer/core";
import { defaultConfig } from "@harmonizer/core/src/defaultConfig";

import { WebAppActions } from "./components/WebAppActions/WebAppActions";

createApp(document.querySelector("#root"), {
  config: defaultConfig,
  lockColorSpace: false,
  actions: <WebAppActions />,
});
