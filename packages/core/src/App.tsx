import { Grid } from "@core/components/Grid/Grid";
import { MainContainer } from "@core/components/MainContainer/MainContainer";

import "./app.css";
import { type AppDependencies, DependenciesContext } from "./DependenciesContext";

export type AppProps = {
  dependencies: AppDependencies;
};

export function App({ dependencies }: AppProps) {
  return (
    <DependenciesContext.Provider value={dependencies}>
      <MainContainer>
        <Grid />
      </MainContainer>
    </DependenciesContext.Provider>
  );
}
