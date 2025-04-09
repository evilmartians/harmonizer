import { batch } from "@spred/core";
import { type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";

import { Actions } from "./components/Actions/Actions";
import { Grid } from "./components/Grid/Grid";
import { MainContainer } from "./components/MainContainer/MainContainer";
import { DependenciesContext, type AppDependencies } from "./DependenciesContext";
import { parseExportConfig } from "./schemas/exportConfig";
import { calculateColorsSynchronously } from "./stores/colors";
import { updateConfig } from "./stores/config";
import { $isColorSpaceLocked } from "./stores/settings";
import { invariant } from "./utils/assertions/invariant";

type AppOptions = {
  customUI?: ReactNode;
  precalculateColors?: boolean;
};

export function createApp(
  element: HTMLElement | null,
  dependencies: AppDependencies,
  { customUI, precalculateColors }: AppOptions,
) {
  invariant(element, "Mount element not found");

  const { config, lockColorSpace } = dependencies;

  const parsedConfig = parseExportConfig(config);

  batch(() => {
    updateConfig(parsedConfig);
    $isColorSpaceLocked.set(lockColorSpace);
  });

  if (precalculateColors) {
    calculateColorsSynchronously();
  }

  createRoot(element).render(
    <StrictMode>
      <DependenciesContext.Provider value={dependencies}>
        <MainContainer>
          <Grid />
          <Actions />
          {customUI}
        </MainContainer>
      </DependenciesContext.Provider>
    </StrictMode>,
  );
}
