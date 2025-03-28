import type { HueName, LchColor, LevelName } from "@core/types";

export type SupportedColor = string | LchColor;
export type VariableColorName = `${HueName}-${LevelName}`;
export type PaletteVariables = Record<VariableColorName, Variable>;
export type PaletteVariablesCollection = {
  collection: VariableCollection;
  variables: PaletteVariables;
};
