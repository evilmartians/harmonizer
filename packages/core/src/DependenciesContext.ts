import { createContext, use } from "react";

import type { ExportConfig } from "./schemas/exportConfig";
import { invariant } from "./utils/assertions/invariant";

export type AppDependencies = {
  config: ExportConfig;
  lockColorSpace: boolean;
};

export const DependenciesContext = createContext<AppDependencies | null>(null);

export function useDependencies() {
  const deps = use(DependenciesContext);

  invariant(deps !== null, "DependenciesContext is not provided");

  return deps;
}
