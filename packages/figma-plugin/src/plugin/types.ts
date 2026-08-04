import type { HueName, LevelName } from "@core/types";

export type VariableColorName = `${HueName}-${LevelName}`;
export type PaletteVariables = Record<VariableColorName, Variable>;
export type PaletteVariablesCollection = {
  collection: VariableCollection;
  variables: PaletteVariables;
};
