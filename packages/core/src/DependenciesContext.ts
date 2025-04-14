import { createContext, type ReactNode, use } from "react";

import { invariant } from "./utils/assertions/invariant";

export type AppDependencies = {
  config: string | Record<string, unknown>;
  lockColorSpace: boolean;
  actions?: ReactNode;
};

export const DependenciesContext = createContext<AppDependencies | null>(null);

export function useDependencies() {
  const deps = use(DependenciesContext);

  invariant(deps !== null, "DependenciesContext is not provided");

  return deps;
}
