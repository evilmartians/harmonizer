import defaultConfig from "@core/defaultConfig.json";
import { createApp } from "@harmonizer/core";

import { WebAppActions } from "./components/WebAppActions/WebAppActions";

createApp(document.querySelector("#root"), {
  config: defaultConfig,
  lockColorSpace: false,
  actions: <WebAppActions />,
});
