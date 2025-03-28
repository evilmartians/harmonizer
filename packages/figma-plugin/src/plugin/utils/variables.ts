import { HueIndex, LevelIndex } from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";
import { PALETTE_NAME } from "@plugin/constants";
import type {
  PaletteVariables,
  PaletteVariablesCollection,
  SupportedColor,
  VariableColorName,
} from "@plugin/types";
import { getVariableColorName, isDocumentInP3, toFigmaRGB } from "@plugin/utils/color";
import type { PaletteConfig } from "src/shared/types";

export function canCreateVariableModes() {
  const collection = figma.variables.createVariableCollection("__test-plan-modes__");

  try {
    collection.addMode("__test-plan-mode__");
    return true;
  } catch {
    return false;
  } finally {
    collection.remove();
  }
}

async function getPalette(name: string) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  return collections.find((collection) => collection.name === name) ?? null;
}

async function getExistingVariables(collection: VariableCollection) {
  const variables = {} as PaletteVariables;

  for (const variableId of collection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);

    if (variable) {
      variables[variable.name as VariableColorName] = variable;
    }
  }

  return variables;
}

function updateVariable(
  collection: VariableCollection,
  variables: PaletteVariables,
  modeId: string,
  variableName: VariableColorName,
  color: SupportedColor,
) {
  const variable =
    variables[variableName] ?? figma.variables.createVariable(variableName, collection, "COLOR");

  variable.setValueForMode(modeId, toFigmaRGB(color, isDocumentInP3()));

  return variable;
}

export async function upsertPaletteVariablesCollection(
  paletteConfig: PaletteConfig,
): Promise<PaletteVariablesCollection> {
  const collection =
    (await getPalette(PALETTE_NAME)) ?? figma.variables.createVariableCollection(PALETTE_NAME);
  const variables = await getExistingVariables(collection);

  const modeId = collection.modes[0]?.modeId;
  invariant(modeId, "Default mode not found");

  for (const [hueKey, hue] of paletteConfig.hues.entries()) {
    for (const [levelKey, level] of paletteConfig.levels.entries()) {
      const variableName = getVariableColorName(level.name, hue.name);
      const color = paletteConfig.colors[`${LevelIndex(levelKey)}-${HueIndex(hueKey)}`];

      invariant(color, `Color not found for level ${levelKey} and hue ${hueKey}`);
      variables[variableName] = updateVariable(collection, variables, modeId, variableName, color);
    }
  }

  return { collection, variables };
}

// upsertPaletteVariablesCollection({ paletteConfig: PaletteConfig }) {
// if (canCreateVariableModes()) {
//   const darkModeId = getDarkModeId(collection);
//   const lightModeId = getLightModeId(collection);
//   variables[LABELS.BACKGROUND] = updateVariable(
//     collection,
//     variables,
//     darkModeId,
//     LABELS.BACKGROUND,
//     paletteConfig.settings.bgColorDark,
//   );
//   variables[LABELS.BACKGROUND] = updateVariable(
//     collection,
//     variables,
//     lightModeId,
//     LABELS.BACKGROUND,
//     paletteConfig.settings.bgColorLight,
//   );

//   for (const [hueKey, hue] of paletteConfig.hues.entries()) {
//     for (const [levelKey, level] of paletteConfig.levels.entries()) {
//       const isDark = levelKey < paletteConfig.settings.bgLightStart;
//       const variableName = getVariableColorName(level.name, hue.name);
//       const color = paletteConfig.colors[`${LevelIndex(levelKey)}-${HueIndex(hueKey)}`];

//       invariant(color, `Color not found for level ${levelKey} and hue ${hueKey}`);
//       variables[variableName] = updateVariable(
//         collection,
//         variables,
//         isDark ? darkModeId : lightModeId,
//         variableName,
//         color,
//       );
//     }
//   }
// }
//}

// function getMode(collection: VariableCollection, modeName: string) {
//   return collection.modes.find((mode) => mode.name === modeName);
// }

// function getDarkModeId(collection: VariableCollection) {
//   let mode = getMode(collection, LABELS.MODE_DARK);

//   if (!mode) {
//     mode = collection.modes[0];
//     invariant(mode, "Default mode not found");
//     collection.renameMode(mode.modeId, LABELS.MODE_DARK);
//   }

//   return mode.modeId;
// }

// function getLightModeId(collection: VariableCollection) {
//   return getMode(collection, LABELS.MODE_LIGHT)?.modeId ?? collection.addMode(LABELS.MODE_LIGHT);
// }
