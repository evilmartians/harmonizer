import { batch } from "@spred/core";
import { createElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import type { AppDependencies } from "./DependenciesContext";
import { parseExportConfig } from "./schemas/exportConfig";
import { calculateColorsSynchronously } from "./stores/colors";
import { updateConfig } from "./stores/config";
import { $isColorSpaceLocked } from "./stores/settings";
import { invariant } from "./utils/assertions/invariant";

export function createApp(element: HTMLElement | null, dependencies: AppDependencies) {
  invariant(element, "Mount element not found");

  const { config, lockColorSpace } = dependencies;

  const parsedConfig = parseExportConfig(config);

  batch(() => {
    updateConfig(parsedConfig);
    $isColorSpaceLocked.set(lockColorSpace);
  });
  calculateColorsSynchronously();

  createRoot(element).render(createElement(StrictMode, null, createElement(App, { dependencies })));
}
