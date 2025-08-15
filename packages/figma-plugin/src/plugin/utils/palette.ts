import { LABELS, PALETTE, PALETTE_CONFIG_KEY, PALETTE_NAME } from "@plugin/constants";
import type { PaletteVariablesCollection } from "@plugin/types";
import { getReferencedSolidPaint, getVariableColorName, isDocumentInP3 } from "@plugin/utils/color";

import {
  getBgValueLeft,
  getBgValueRight,
  isSingleBgLeft,
  isSingleBgRight,
} from "@core/stores/utils/bg";
import { HueIndex, LevelIndex } from "@core/types";
import type { ExportConfigWithColors } from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";

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

export function getStoredConfig() {
  const frame = getExistingPaletteFrame();

  if (!frame) {
    return null;
  }

  return frame.getPluginData(PALETTE_CONFIG_KEY) || null;
}

function createPaletteFrame(config: ExportConfigWithColors, position: { x: number; y: number }) {
  const frame = figma.createFrame();
  const width =
    PALETTE.CELL_WIDTH * config.levels.length + PALETTE.HUE_HEADER_WIDTH + PALETTE.PADDING * 2;
  const height =
    PALETTE.CELL_HEIGHT * config.hues.length + PALETTE.LEVEL_HEADER_HEIGHT + PALETTE.PADDING * 2;

  frame.name = PALETTE_NAME;
  frame.resize(width, height);
  frame.x = position.x;
  frame.y = position.y;

  return frame;
}

function createLevelHeader(
  frame: FrameNode,
  config: ExportConfigWithColors,
  levelIndex: LevelIndex,
) {
  const level = config.levels[levelIndex];

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
  modelLabel.characters = config.settings.contrastModel;
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

function createHueHeader(frame: FrameNode, config: ExportConfigWithColors, hueIndex: HueIndex) {
  const hue = config.hues[hueIndex];

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
  groups: { left: GroupNode; right: GroupNode },
  config: ExportConfigWithColors,
  levelIndex: LevelIndex,
  hueIndex: HueIndex,
  paint: SolidPaint,
) {
  const node = figma.createRectangle();
  const isBgLeft = levelIndex < config.settings.bgRightStart;
  const levelName = config.levels[levelIndex]?.name;
  const hueName = config.hues[hueIndex]?.name;

  invariant(levelName, "Level name not found");
  invariant(hueName, "Hue name not found");

  node.name = getVariableColorName(levelName, hueName);
  node.resize(PALETTE.CELL_WIDTH, PALETTE.CELL_HEIGHT);
  node.x = PALETTE.PADDING + PALETTE.HUE_HEADER_WIDTH + PALETTE.CELL_WIDTH * levelIndex;
  node.y = PALETTE.PADDING + PALETTE.LEVEL_HEADER_HEIGHT + PALETTE.CELL_HEIGHT * hueIndex;
  node.fills = [paint];
  (isBgLeft ? groups.left : groups.right).appendChild(node);
}

function getBgColorLeft(config: ExportConfigWithColors) {
  return getBgValueLeft(
    isSingleBgRight(config.settings.bgRightStart),
    config.settings.bgColorLeft,
    config.settings.bgColorRight,
  );
}

function getBgColorRight(config: ExportConfigWithColors) {
  return getBgValueRight(
    isSingleBgLeft(config.settings.bgRightStart, config.levels.length),
    config.settings.bgColorLeft,
    config.settings.bgColorRight,
  );
}

export async function drawPalette(
  config: ExportConfigWithColors,
  variablesCollection: PaletteVariablesCollection,
) {
  await figma.loadFontAsync(PALETTE.LABEL_FONT_SANS);
  await figma.loadFontAsync(PALETTE.LABEL_FONT_MONO);

  // Frame
  const existingFrame = getExistingPaletteFrame();
  const frame = createPaletteFrame(config, existingFrame ?? getViewportCenter());

  // Color samples
  const BgWidthLeft =
    PALETTE.PADDING + PALETTE.HUE_HEADER_WIDTH + PALETTE.CELL_WIDTH * config.settings.bgRightStart;
  const BgWidthRight = frame.width - BgWidthLeft;
  const bgLeft = figma.createRectangle();
  bgLeft.resize(BgWidthLeft, frame.height);
  bgLeft.fills = [getReferencedSolidPaint(getBgColorLeft(config), undefined, isDocumentInP3())];
  frame.appendChild(bgLeft);

  const bgRight = figma.createRectangle();
  bgRight.resize(BgWidthRight, frame.height);
  bgRight.x = BgWidthLeft;
  bgRight.fills = [getReferencedSolidPaint(getBgColorRight(config), undefined, isDocumentInP3())];
  frame.appendChild(bgRight);

  const groupLeft = figma.group([bgLeft], frame);
  groupLeft.name = LABELS.MODE_DARK;

  const groupRight = figma.group([bgRight], frame);
  groupRight.name = LABELS.MODE_LIGHT;

  const levelHeaderGroups = [];
  const hueHeaderGroups = [];
  // Draw all cells
  for (const [levelKey, level] of config.levels.entries()) {
    const levelIndex = LevelIndex(levelKey);

    levelHeaderGroups.push(createLevelHeader(frame, config, levelIndex));

    for (const [hueKey, hue] of config.hues.entries()) {
      const hueIndex = HueIndex(hueKey);
      const color = config.colors[`${levelIndex}-${hueIndex}`];

      invariant(color, `Color not found for level ${levelIndex} and hue ${hueIndex}`);

      if (levelKey === 0) {
        hueHeaderGroups.push(createHueHeader(frame, config, hueIndex));
      }

      createColorCell(
        { left: groupLeft, right: groupRight },
        config,
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

  const { colors, ...exportConfig } = config;
  frame.setPluginData(PALETTE_CONFIG_KEY, JSON.stringify(exportConfig));

  existingFrame?.remove();
  figma.currentPage.appendChild(frame);

  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
}
