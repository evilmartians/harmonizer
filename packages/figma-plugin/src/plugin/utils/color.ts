import type { HueName, LevelName } from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";
import { toP3 } from "@core/utils/colors/toP3";
import { toRgb } from "@core/utils/colors/toRgb";
import { clamp } from "@core/utils/number/clamp";
import type { SupportedColor, VariableColorName } from "@plugin/types";

export function isDocumentInP3() {
  return figma.root.documentColorProfile === "DISPLAY_P3";
}

export function getVariableColorName(levelName: LevelName, hueName: HueName): VariableColorName {
  return `${hueName}-${levelName}`;
}

export function toFigmaRGB(input: SupportedColor, inP3: boolean): RGB {
  const preparedInput = typeof input === "string" ? input : ({ mode: "oklch", ...input } as const);
  const convertedColor = inP3 ? toP3(preparedInput) : toRgb(preparedInput);

  invariant(convertedColor, `Color conversion failed for ${JSON.stringify(input)}`);

  return {
    r: clamp(0, convertedColor.r, 1),
    g: clamp(0, convertedColor.g, 1),
    b: clamp(0, convertedColor.b, 1),
  };
}

export function getReferencedSolidPaint(
  fallbackColor: SupportedColor,
  variable: Variable | undefined,
  inP3: boolean,
): SolidPaint {
  const boundVariables = variable
    ? ({
        color: {
          type: "VARIABLE_ALIAS",
          id: variable.id,
        },
      } as const)
    : undefined;

  const rgba = toFigmaRGB(fallbackColor, inP3);
  const solid: SolidPaint = {
    type: "SOLID",
    color: { r: rgba.r, g: rgba.g, b: rgba.b },
    boundVariables,
  } as const;

  return solid;
}
