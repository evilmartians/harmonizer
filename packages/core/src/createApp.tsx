import { StrictMode, type ReactNode } from "react";

import { batch } from "@spred/core";
import { createRoot } from "react-dom/client";

import { BetaMenu } from "./components/BetaMenu/BetaMenu";
import { FloatingActions } from "./components/FloatingActions/FloatingActions";
import { Grid, type GridBanner } from "./components/Grid/Grid";
import { MainContainer } from "./components/MainContainer/MainContainer";
import { DependenciesContext, type AppDependencies } from "./DependenciesContext";
import { parseExportConfig } from "./schemas/exportConfig";
import { calculateColorsSynchronously } from "./stores/colors";
import { updateConfig } from "./stores/config";
import { $isColorSpaceLocked } from "./stores/settings";
import { invariant } from "./utils/assertions/invariant";

type AppOptions = {
  customUI?: {
    gridBanner?: GridBanner;
    actions?: ReactNode;
    afterGridContent?: ReactNode;
  };
  precalculateColors?: boolean;
  enableBetaMenu?: boolean;
};

export function createApp(
  element: HTMLElement | null,
  dependencies: AppDependencies,
  { customUI, precalculateColors, enableBetaMenu = true }: AppOptions,
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
          {(enableBetaMenu || customUI?.actions) && (
            <FloatingActions>
              {enableBetaMenu && <BetaMenu />}
              {customUI?.actions}
            </FloatingActions>
          )}
          {customUI?.afterGridContent}
        </MainContainer>
      </DependenciesContext.Provider>
    </StrictMode>,
  );
}
