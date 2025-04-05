import {
  getBgDarkValue,
  getBgLightValue,
  isSingleDarkBg,
  isSingleLightBg,
} from "@core/stores/utils/bg";
import { HueIndex, LevelIndex } from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";
import { LABELS, PALETTE, PALETTE_CONFIG_KEY, PALETTE_NAME } from "@plugin/constants";
import type { PaletteVariablesCollection } from "@plugin/types";
import { getReferencedSolidPaint, getVariableColorName, isDocumentInP3 } from "@plugin/utils/color";
import type { PaletteConfig } from "src/shared/types";

function getViewportCenter() {
  const viewportBounds = figma.viewport.bounds;

  return {
    x: Math.round(viewportBounds.width / 2 + viewportBounds.x),
    y: Math.round(viewportBounds.height / 2 + viewportBounds.y),
  };
}

export function getExistingPaletteFrame() {
  return figma.currentPage.findOne((node) => node.type === "FRAME" && node.name === PALETTE_NAME);
}

export function getExistingPaletteConfig() {
  const frame = getExistingPaletteFrame();

  if (!frame) {
    return null;
  }

  return frame.getPluginData(PALETTE_CONFIG_KEY) || null;
}

function createPaletteFrame(paletteConfig: PaletteConfig, position: { x: number; y: number }) {
  const frame = figma.createFrame();
  const width =
    PALETTE.CELL_WIDTH * paletteConfig.levels.length +
    PALETTE.HUE_HEADER_WIDTH +
    PALETTE.PADDING * 2;
  const height =
    PALETTE.CELL_HEIGHT * paletteConfig.hues.length +
    PALETTE.LEVEL_HEADER_HEIGHT +
    PALETTE.PADDING * 2;

  frame.name = PALETTE_NAME;
  frame.resize(width, height);
  frame.x = position.x;
  frame.y = position.y;

  return frame;
}

function createLevelHeader(frame: FrameNode, paletteConfig: PaletteConfig, levelIndex: LevelIndex) {
  const level = paletteConfig.levels[levelIndex];

  invariant(level, "Level not found");

  // Contrast
  const contrastLabel = figma.createText();
  contrastLabel.fontName = PALETTE.LABEL_FONT_MONO;
  contrastLabel.fontSize = PALETTE.LABEL_FONT_SIZE_L;
  contrastLabel.fills = [PALETTE.LABEL_FILL];
  contrastLabel.resize(PALETTE.CELL_WIDTH, contrastLabel.height);
  contrastLabel.textAlignHorizontal = "CENTER";
  contrastLabel.x = PALETTE.HUE_HEADER_WIDTH + PALETTE.PADDING + PALETTE.CELL_WIDTH * levelIndex;
  contrastLabel.y = PALETTE.PADDING;
  contrastLabel.characters = String(level.contrast);
  frame.appendChild(contrastLabel);
  // Model
  const modelLabel = figma.createText();
  modelLabel.fontName = PALETTE.LABEL_FONT_SANS;
  modelLabel.fontSize = PALETTE.LABEL_FONT_SIZE_S;
  modelLabel.fills = [PALETTE.LABEL_FILL];
  modelLabel.resize(PALETTE.CELL_WIDTH, modelLabel.height);
  modelLabel.textAlignHorizontal = "CENTER";
  modelLabel.x = PALETTE.HUE_HEADER_WIDTH + PALETTE.PADDING + PALETTE.CELL_WIDTH * levelIndex;
  modelLabel.y = PALETTE.PADDING + contrastLabel.height;
  modelLabel.characters = paletteConfig.settings.contrastModel;
  frame.appendChild(modelLabel);
  // Level
  const levelLabel = figma.createText();
  levelLabel.fontName = PALETTE.LABEL_FONT_SANS;
  levelLabel.fontSize = PALETTE.LABEL_FONT_SIZE_M;
  levelLabel.lineHeight = PALETTE.LABEL_LINE_HEIGHT;
  levelLabel.fills = [PALETTE.LABEL_FILL];
  levelLabel.resize(PALETTE.CELL_WIDTH, levelLabel.height);
  levelLabel.textAlignHorizontal = "CENTER";
  levelLabel.x = PALETTE.HUE_HEADER_WIDTH + PALETTE.PADDING + PALETTE.CELL_WIDTH * levelIndex;
  levelLabel.y = PALETTE.PADDING + contrastLabel.height + modelLabel.height + 24;
  levelLabel.characters = level.name;
  frame.appendChild(levelLabel);

  const levelHeaderGroup = figma.group([contrastLabel, modelLabel, levelLabel], frame);
  levelHeaderGroup.name = `${level.name} level`;

  return levelHeaderGroup;
}

function createHueHeader(frame: FrameNode, paletteConfig: PaletteConfig, hueIndex: HueIndex) {
  const hue = paletteConfig.hues[hueIndex];

  invariant(hue, "Hue not found");

  const hueLabel = figma.createText();
  hueLabel.fontName = PALETTE.LABEL_FONT_SANS;
  hueLabel.fontSize = PALETTE.LABEL_FONT_SIZE_M;
  hueLabel.lineHeight = PALETTE.LABEL_LINE_HEIGHT;
  hueLabel.fills = [PALETTE.LABEL_FILL];
  hueLabel.x = PALETTE.PADDING;
  hueLabel.y =
    PALETTE.LEVEL_HEADER_HEIGHT +
    PALETTE.PADDING +
    PALETTE.CELL_HEIGHT / 2 -
    10 +
    PALETTE.CELL_HEIGHT * hueIndex;
  hueLabel.characters = hue.name;
  hueLabel.name = hue.name;
  frame.appendChild(hueLabel);

  return hueLabel;
}

function createColorCell(
  groups: { dark: GroupNode; light: GroupNode },
  paletteConfig: PaletteConfig,
  levelIndex: LevelIndex,
  hueIndex: HueIndex,
  paint: SolidPaint,
) {
  const node = figma.createRectangle();
  const isDark = levelIndex < paletteConfig.settings.bgLightStart;
  const levelName = paletteConfig.levels[levelIndex]?.name;
  const hueName = paletteConfig.hues[hueIndex]?.name;

  invariant(levelName, "Level name not found");
  invariant(hueName, "Hue name not found");

  node.name = getVariableColorName(levelName, hueName);
  node.resize(PALETTE.CELL_WIDTH, PALETTE.CELL_HEIGHT);
  node.x = PALETTE.PADDING + PALETTE.HUE_HEADER_WIDTH + PALETTE.CELL_WIDTH * levelIndex;
  node.y = PALETTE.PADDING + PALETTE.LEVEL_HEADER_HEIGHT + PALETTE.CELL_HEIGHT * hueIndex;
  node.fills = [paint];
  (isDark ? groups.dark : groups.light).appendChild(node);
}

function getBgColorDark(paletteConfig: PaletteConfig) {
  return getBgDarkValue(
    isSingleLightBg(paletteConfig.settings.bgLightStart),
    paletteConfig.settings.bgColorDark,
    paletteConfig.settings.bgColorLight,
  );
}

function getBgColorLight(paletteConfig: PaletteConfig) {
  return getBgLightValue(
    isSingleDarkBg(paletteConfig.settings.bgLightStart, paletteConfig.levels.length),
    paletteConfig.settings.bgColorDark,
    paletteConfig.settings.bgColorLight,
  );
}

export async function drawPalette(
  paletteConfig: PaletteConfig,
  variablesCollection: PaletteVariablesCollection,
) {
  await figma.loadFontAsync(PALETTE.LABEL_FONT_SANS);
  await figma.loadFontAsync(PALETTE.LABEL_FONT_MONO);

  // Frame
  const existingFrame = getExistingPaletteFrame();
  const frame = createPaletteFrame(paletteConfig, existingFrame ?? getViewportCenter());

  // Color samples
  const darkBgWidth =
    PALETTE.PADDING +
    PALETTE.HUE_HEADER_WIDTH +
    PALETTE.CELL_WIDTH * paletteConfig.settings.bgLightStart;
  const lightBgWidth = frame.width - darkBgWidth;
  const darkBg = figma.createRectangle();
  darkBg.resize(darkBgWidth, frame.height);
  darkBg.fills = [
    getReferencedSolidPaint(getBgColorDark(paletteConfig), undefined, isDocumentInP3()),
  ];
  frame.appendChild(darkBg);

  const lightBg = figma.createRectangle();
  lightBg.resize(lightBgWidth, frame.height);
  lightBg.x = darkBgWidth;
  lightBg.fills = [
    getReferencedSolidPaint(getBgColorLight(paletteConfig), undefined, isDocumentInP3()),
  ];
  frame.appendChild(lightBg);

  const darkGroup = figma.group([darkBg], frame);
  darkGroup.name = LABELS.MODE_DARK;

  const lightGroup = figma.group([lightBg], frame);
  lightGroup.name = LABELS.MODE_LIGHT;

  const levelHeaderGroups = [];
  const hueHeaderGroups = [];
  // Draw all cells
  for (const [levelKey, level] of paletteConfig.levels.entries()) {
    const levelIndex = LevelIndex(levelKey);

    levelHeaderGroups.push(createLevelHeader(frame, paletteConfig, levelIndex));

    for (const [hueKey, hue] of paletteConfig.hues.entries()) {
      const hueIndex = HueIndex(hueKey);
      const color = paletteConfig.colors[`${levelIndex}-${hueIndex}`];

      invariant(color, `Color not found for level ${levelIndex} and hue ${hueIndex}`);

      if (levelKey === 0) {
        hueHeaderGroups.push(createHueHeader(frame, paletteConfig, hueIndex));
      }

      createColorCell(
        { dark: darkGroup, light: lightGroup },
        paletteConfig,
        levelIndex,
        hueIndex,
        getReferencedSolidPaint(
          color,
          variablesCollection.variables[getVariableColorName(level.name, hue.name)],
          isDocumentInP3(),
        ),
      );
    }
  }

  const levelsGroup = figma.group(levelHeaderGroups, frame);
  levelsGroup.name = "Levels";
  const huesGroup = figma.group(hueHeaderGroups, frame);
  huesGroup.name = "Hues";

  const { colors, ...exportConfig } = paletteConfig;
  frame.setPluginData(PALETTE_CONFIG_KEY, JSON.stringify(exportConfig));

  existingFrame?.remove();
  figma.currentPage.appendChild(frame);

  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
}
