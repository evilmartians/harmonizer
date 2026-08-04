import type { HueName, LevelName } from "@core/types";
import type { VariableColorName } from "@plugin/types";
import type { FigmaRgb } from "@shared/types";

export function isDocumentInP3() {
  return figma.root.documentColorProfile === "DISPLAY_P3";
}

export function getVariableColorName(levelName: LevelName, hueName: HueName): VariableColorName {
  return `${hueName}-${levelName}`;
}

export function getReferencedSolidPaint(
  fallbackColor: FigmaRgb,
  variable: Variable | undefined,
): SolidPaint {
  const boundVariables = variable
    ? ({
        color: {
          type: "VARIABLE_ALIAS",
          id: variable.id,
        },
      } as const)
    : undefined;

  const solid: SolidPaint = {
    type: "SOLID",
    color: { r: fallbackColor.r, g: fallbackColor.g, b: fallbackColor.b },
    boundVariables,
  } as const;

  return solid;
}
