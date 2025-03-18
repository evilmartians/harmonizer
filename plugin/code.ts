const SLOT_WIDTH = 100;
const SLOT_HEIGHT = 50;
const LABEL_FILL = {
  type: "SOLID",
  color: { r: 0.5, g: 0.5, b: 0.5 },
} as Paint;
const LABEL_FONT_SIZE_L = 32;
const LABEL_FONT_SIZE_M = 16;
const LABEL_FONT_SIZE_S = 12;
const LABEL_LINE_HEIGHT = { value: 20, unit: "PIXELS" } as LineHeight;
const PADDING = 40;
const HUE_SECTION_WIDTH = 100;
const LEVEL_SECTION_HEIGHT = 120;
const PALETTE_NAME = "Harmonized Palette";

figma.showUI(__html__);

figma.on("run", async () => {
  const paletteExists = (await getPalette()) !== undefined;
  figma.ui.postMessage({
    paletteExists,
  });
});

figma.ui.onmessage = async (msg: { type: string; json: string }) => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const viewportBounds = figma.viewport.bounds;
  const centerX = Math.round(viewportBounds.width / 2 + viewportBounds.x);
  const centerY = Math.round(viewportBounds.height / 2 + viewportBounds.y);

  if (msg.type === "create-palette") {
    const json = msg.json;
    const jsonData = JSON.parse(json);

    // Variables
    await createOrUpdateVariables(jsonData["hues"]);

    // Hues
    const hueInfo = parseHue(jsonData["hues"]);
    const levelInfo = parseColorLevels(jsonData["config"]["levels"]);
    const configInfo = jsonData["config"];

    // Frame
    const background = configInfo["background"];
    const darkBackground = hexToRgba(background["dark"]);
    const lightBackgroundStartAt = background["lightStartAt"];
    const lightBackground = hexToRgba(background["light"]);
    const frame = figma.createFrame();
    const frameWidth =
      SLOT_WIDTH * levelInfo.length + HUE_SECTION_WIDTH + PADDING * 2;
    const frameHeight =
      SLOT_HEIGHT * hueInfo.length + LEVEL_SECTION_HEIGHT + PADDING * 2;
    frame.resize(frameWidth, frameHeight);
    frame.x = centerX;
    frame.y = centerY;
    frame.name = PALETTE_NAME;
    const lightBackgroundStop =
      (PADDING + HUE_SECTION_WIDTH + SLOT_WIDTH * lightBackgroundStartAt) /
      frameWidth;
    frame.fills = [
      {
        type: "GRADIENT_LINEAR",
        gradientTransform: [
          [1, 0, 0], // Horizontal direction
          [0, 1, 0], // Vertical remains unchanged
        ],
        gradientStops: [
          { position: lightBackgroundStop, color: darkBackground }, // Left side
          { position: lightBackgroundStop, color: lightBackground }, // Right side
        ],
      },
    ];
    figma.currentPage.appendChild(frame);

    // Color samples
    const colorConfigs = await parseColors(jsonData["hues"]);
    for (const colorConfig of colorConfigs) {
      const rect = figma.createRectangle();
      rect.resize(SLOT_WIDTH, SLOT_HEIGHT);
      rect.x = PADDING + HUE_SECTION_WIDTH + SLOT_WIDTH * colorConfig.x;
      rect.y = PADDING + LEVEL_SECTION_HEIGHT + SLOT_HEIGHT * colorConfig.y;
      rect.fills = [
        {
          type: "SOLID",
          color: colorConfig.color,
          boundVariables: { color: colorConfig.colorVariable },
        },
      ];
      rect.name = colorConfig.name;
      frame.appendChild(rect);
    }

    // Levels
    const model = jsonData["config"]["model"];
    for (const level of levelInfo) {
      // Contrast
      const contrastLabel = figma.createText();
      contrastLabel.fontName = { family: "Inter", style: "Regular" };
      contrastLabel.fontSize = LABEL_FONT_SIZE_L;
      contrastLabel.fills = [LABEL_FILL];
      contrastLabel.resize(SLOT_WIDTH, contrastLabel.height);
      contrastLabel.textAlignHorizontal = "CENTER";
      contrastLabel.x = HUE_SECTION_WIDTH + PADDING + SLOT_WIDTH * level.x;
      contrastLabel.y = PADDING;
      contrastLabel.characters = level.contrast;
      frame.appendChild(contrastLabel);
      // Model
      const modelLabel = figma.createText();
      modelLabel.fontName = { family: "Inter", style: "Regular" };
      modelLabel.fontSize = LABEL_FONT_SIZE_S;
      modelLabel.fills = [LABEL_FILL];
      modelLabel.resize(SLOT_WIDTH, modelLabel.height);
      modelLabel.textAlignHorizontal = "CENTER";
      modelLabel.x = HUE_SECTION_WIDTH + PADDING + SLOT_WIDTH * level.x;
      modelLabel.y = PADDING + contrastLabel.height;
      modelLabel.characters = model;
      frame.appendChild(modelLabel);
      // Level
      const levelLabel = figma.createText();
      levelLabel.fontName = { family: "Inter", style: "Regular" };
      levelLabel.fontSize = LABEL_FONT_SIZE_M;
      levelLabel.lineHeight = LABEL_LINE_HEIGHT;
      levelLabel.fills = [LABEL_FILL];
      levelLabel.resize(SLOT_WIDTH, levelLabel.height);
      levelLabel.textAlignHorizontal = "CENTER";
      levelLabel.x = HUE_SECTION_WIDTH + PADDING + SLOT_WIDTH * level.x;
      levelLabel.y = PADDING + contrastLabel.height + modelLabel.height + 24;
      levelLabel.characters = level.name;
      frame.appendChild(levelLabel);
    }

    // Hues
    for (const hue of hueInfo) {
      const hueLabel = figma.createText();
      hueLabel.fontName = { family: "Inter", style: "Regular" };
      hueLabel.fontSize = LABEL_FONT_SIZE_M;
      hueLabel.lineHeight = LABEL_LINE_HEIGHT;
      hueLabel.fills = [LABEL_FILL];
      hueLabel.x = PADDING;
      hueLabel.y =
        LEVEL_SECTION_HEIGHT +
        PADDING +
        SLOT_HEIGHT / 2 -
        10 +
        SLOT_HEIGHT * hue.y;
      hueLabel.characters = hue.name;
      hueLabel.name = hue.name;
      frame.appendChild(hueLabel);
    }

    // Wrap created items in a group
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
  }
};

interface LevelInfo {
  name: string;
  contrast: string;
  x: number;
}

function parseColorLevels(levels: Record<string, string>): LevelInfo[] {
  const levelInfo: LevelInfo[] = [];

  for (let j = 0; j < Object.keys(levels).length; j++) {
    const level = Object.keys(levels)[j];
    const contrast = levels[level];

    levelInfo.push({
      name: level,
      contrast: contrast,
      x: j,
    });
  }

  return levelInfo;
}

interface HueInfo {
  name: string;
  y: number;
}

function parseHue(json: Record<string, Record<string, string>>): HueInfo[] {
  const hues = Object.keys(json)
    .filter((key) => key !== "levels")
    .map((key, index) => ({ name: key, y: index }));

  return hues;
}

interface ColorConfig {
  name: string;
  x: number;
  y: number;
  color: { r: number; g: number; b: number };
  colorVariable: VariableAlias | undefined;
}

async function parseColors(
  json: Record<string, Record<string, string>>
): Promise<ColorConfig[]> {
  const paletteCollection = await getPalette();
  if (!paletteCollection) return [];
  const colorConfigs: ColorConfig[] = [];

  for (let i = 0; i < Object.keys(json).length; i++) {
    const item = Object.keys(json)[i];
    const itemJson = json[item];
    for (let j = 0; j < Object.keys(itemJson).length; j++) {
      const shade = Object.keys(itemJson)[j];
      const shadeName = `${item}-${shade}`;
      const variable = await getVariableWithName(paletteCollection, shadeName);
      const color = hexToRgb(itemJson[shade]);
      const variableAlias = (
        variable
          ? {
              type: "VARIABLE_ALIAS",
              id: variable.id,
            }
          : undefined
      ) as VariableAlias | undefined;

      colorConfigs.push({
        name: shadeName,
        x: j,
        y: i,
        color: color,
        colorVariable: variableAlias,
      });
    }
  }

  return colorConfigs;
}

function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
  };
}

function hexToRgba(hex: string) {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
    a: 1,
  };
}

async function createOrUpdateVariables(
  hues: Record<string, Record<string, string>>
) {
  console.log("createOrUpdateVariables");
  const paletteCollection = await getPalette();
  if (paletteCollection !== undefined) {
    updateVariables(hues, paletteCollection);
  } else {
    createVariables(hues);
  }
}

async function updateVariables(
  hues: Record<string, Record<string, string>>,
  paletteCollection: VariableCollection
) {
  const modeId = paletteCollection.modes[0].modeId;

  for (const hue in hues) {
    for (const shade in hues[hue]) {
      const hex = hues[hue][shade];
      const rgb = hexToRgb(hex);

      const varName = `${hue}-${shade}`;
      const variable = await getVariableWithName(paletteCollection, varName);
      if (variable) {
        variable.setValueForMode(modeId, rgb);
      } else {
        createVariable(paletteCollection, hue, shade, hex);
      }
    }
  }
}

function createVariables(hues: Record<string, Record<string, string>>) {
  const paletteCollection =
    figma.variables.createVariableCollection(PALETTE_NAME);
  for (const hue in hues) {
    for (const shade in hues[hue]) {
      const hex = hues[hue][shade];
      createVariable(paletteCollection, hue, shade, hex);
    }
  }
}

function createVariable(
  collection: VariableCollection,
  hue: string,
  shade: string,
  hex: string
) {
  const rgb = hexToRgb(hex);
  const varName = `${hue}-${shade}`;
  const modeId = collection.modes[0].modeId;
  const variable = figma.variables.createVariable(varName, collection, "COLOR");
  variable.setValueForMode(modeId, rgb);
}

async function getPalette() {
  return (await figma.variables.getLocalVariableCollectionsAsync()).find(
    (collection) => collection.name === PALETTE_NAME
  );
}

async function getVariableWithName(
  collection: VariableCollection,
  name: string
) {
  for (const variableId of collection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (variable?.name === name) {
      return variable;
    }
  }
  return undefined;
}
