import { type ReactNode, StrictMode } from "react";

import { batch } from "@spred/core";
import { createRoot } from "react-dom/client";

import { FloatingActions } from "./components/FloatingActions/FloatingActions";
import { Grid } from "./components/Grid/Grid";
import { MainContainer } from "./components/MainContainer/MainContainer";
import { DependenciesContext, type AppDependencies } from "./DependenciesContext";
import { parseExportConfig } from "./schemas/exportConfig";
import { calculateColorsSynchronously } from "./stores/colors";
import { updateConfig } from "./stores/config";
import { $isColorSpaceLocked } from "./stores/settings";
import { invariant } from "./utils/assertions/invariant";

type AppOptions = {
  customUI?: {
    gridBanner?: ReactNode;
    actions?: ReactNode;
    afterGridContent?: ReactNode;
  };
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
          <Grid banner={customUI?.gridBanner} />
          {customUI?.actions && <FloatingActions>{customUI.actions}</FloatingActions>}
          {customUI?.afterGridContent}
        </MainContainer>
      </DependenciesContext.Provider>
    </StrictMode>,
  );
}
