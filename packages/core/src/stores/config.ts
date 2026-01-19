import { batch, signal } from "@spred/core";
import { debounce } from "es-toolkit";

import { defaultConfig } from "@core/defaultConfig";
import {
  CURRENT_CONFIG_VERSION,
  parseExportConfig,
  decodeHashConfig,
} from "@core/schemas/exportConfig";
import type { ExportConfig } from "@core/types";
import { deflate } from "@core/utils/compression/deflate";
import { encodeUrlSafeBase64 } from "@core/utils/compression/encodeUrlSafeBase64";
import { getCssVariablesConfig } from "@core/utils/config/getCssVariablesConfig";
import { getJsonVariablesConfig } from "@core/utils/config/getJsonVariablesConfig";
import { getTailwindConfig } from "@core/utils/config/getTailwindConfig";
import { downloadTextFile } from "@core/utils/file/downloadTextFile";

import {
  $areHuesValid,
  $areLevelsValid,
  $hueIds,
  $levelIds,
  getHue,
  getIndexedColors,
  getLevel,
  overwriteHues,
  overwriteLevels,
  pregenerateFallbackColorsMap,
  requestColorsRecalculation,
} from "./colors";
import {
  $bgRightStart,
  $isColorSpaceLocked,
  bgColorLeftStore,
  bgColorRightStore,
  chromaModeStore,
  colorSpaceStore,
  contrastModelStore,
  directionModeStore,
} from "./settings";
import { getHueStore, getLevelStore } from "./utils";

export const $exportConfig = signal<ExportConfig>((get) => {
  return {
    version: CURRENT_CONFIG_VERSION,
    levels: get($levelIds).map((levelId) => {
      const level = getLevel(levelId);

      return {
        name: get(level.name.$lastValidValue),
        contrast: get(level.contrast.$lastValidValue),
        chroma: get(level.chroma.$lastValidValue),
        chromaCap: get(level.chromaCap.$lastValidValue),
      };
    }),
    hues: get($hueIds).map((hueId) => {
      const hue = getHue(hueId);

      return { name: get(hue.name.$lastValidValue), angle: get(hue.angle.$lastValidValue) };
    }),
    settings: {
      contrastModel: get(contrastModelStore.$lastValidValue),
      directionMode: get(directionModeStore.$lastValidValue),
      chromaMode: get(chromaModeStore.$lastValidValue),
      bgColorLight: get(bgColorRightStore.$lastValidValue),
      bgColorDark: get(bgColorLeftStore.$lastValidValue),
      bgLightStart: get($bgRightStart),
      colorSpace: get(colorSpaceStore.$lastValidValue),
    },
  };
});

export const $exportConfigHash = signal<string>("#");

const COMPRESSION_DEBOUNCE_MS = 300;
let exportConfigHashAbortController: AbortController | null = null;

$exportConfig.subscribe(
  debounce(async (config) => {
    if (exportConfigHashAbortController) {
      exportConfigHashAbortController.abort();
    }

    exportConfigHashAbortController = new AbortController();

    try {
      const compressed = await deflate(
        JSON.stringify(config),
        exportConfigHashAbortController.signal,
      );
      const encoded = encodeUrlSafeBase64(compressed);

      $exportConfigHash.set(`#${encoded}`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Compression failed:", error);
    }
  }, COMPRESSION_DEBOUNCE_MS),
);

export const $isExportConfigValid = signal((get) => get($areLevelsValid) && get($areHuesValid));

export function getConfig(): ExportConfig {
  return $exportConfig.value;
}

export function getExportConfigWithColors() {
  return { ...getConfig(), colors: getIndexedColors() };
}

async function parseConfigFromHash(hash: string): Promise<ExportConfig | null> {
  try {
    return await decodeHashConfig(hash);
  } catch (error) {
    console.error("Failed to parse config from hash:", error);
    return null;
  }
}

export async function parseConfigFromHashAndUpdate(hash: string): Promise<boolean> {
  const config = await parseConfigFromHash(hash);

  if (config) {
    updateConfig(config);
    return true;
  }

  return false;
}

export async function syncConfigWithLocationHash(): Promise<ExportConfig> {
  $exportConfigHash.subscribe((newHash) => {
    if (newHash !== globalThis.location.hash) {
      globalThis.history.replaceState(null, "", newHash);
    }
  }, false);
  globalThis.addEventListener(
    "hashchange",
    async () => {
      await parseConfigFromHashAndUpdate(globalThis.location.hash);
    },
    { passive: true },
  );

  const parsedInitialConfig = await parseConfigFromHash(globalThis.location.hash);
  return parsedInitialConfig ?? (await parseExportConfig(defaultConfig));
}

export function updateConfig(config: ExportConfig) {
  batch(() => {
    const isDifferentFromLockedColorSpace =
      $isColorSpaceLocked.value &&
      colorSpaceStore.$lastValidValue.value !== config.settings.colorSpace;
    const levels = config.levels.map(getLevelStore);
    const hues = config.hues.map(getHueStore);

    contrastModelStore.$raw.set(config.settings.contrastModel);
    directionModeStore.$raw.set(config.settings.directionMode);
    chromaModeStore.$raw.set(config.settings.chromaMode);
    bgColorRightStore.$raw.set(config.settings.bgColorLight);
    bgColorLeftStore.$raw.set(config.settings.bgColorDark);
    $bgRightStart.set(config.settings.bgLightStart);
    if (!isDifferentFromLockedColorSpace) {
      colorSpaceStore.$raw.set(config.settings.colorSpace);
    }
    overwriteLevels(levels);
    overwriteHues(hues);
    pregenerateFallbackColorsMap(
      levels.map((level) => level.id),
      hues.map((hue) => hue.id),
    );

    if (isDifferentFromLockedColorSpace) {
      // eslint-disable-next-line no-alert
      alert(
        "The color space in the config is different from the document color space. Colors will be generated in the document color space.",
      );
    }
  });
  requestColorsRecalculation();
}

export async function uploadConfig(file?: File) {
  if (!file) return;

  const text = await file.text();
  const config = await parseExportConfig(text);
  updateConfig(config);
}

export const ExportTargets = {
  "tailwind-v3": {
    name: "Tailwind v3",
    filename: "tailwind.config.js",
    mimetype: "application/javascript",
    getFileData: () => getTailwindConfig(getExportConfigWithColors(), $exportConfigHash.value),
  },
  "css-variables": {
    name: "CSS variables",
    filename: "harmonized-palette.css",
    mimetype: "application/javascript",
    getFileData: () => getCssVariablesConfig(getExportConfigWithColors(), $exportConfigHash.value),
  },
  json: {
    name: "JSON Config",
    filename: "harmonized-palette.json",
    mimetype: "application/json",
    getFileData: () => JSON.stringify(getJsonVariablesConfig(getExportConfigWithColors()), null, 2),
  },
  harmonizer: {
    name: "Harmonizer Config",
    filename: "harmonizer-config.json",
    mimetype: "application/json",
    getFileData: () => JSON.stringify(getConfig(), null, 2),
  },
};

export type ExportTarget = keyof typeof ExportTargets;

export function downloadConfigTarget(type: ExportTarget) {
  const targetConfig = ExportTargets[type];

  downloadTextFile({
    filename: targetConfig.filename,
    mimetype: targetConfig.mimetype,
    data: targetConfig.getFileData(),
  });
}
