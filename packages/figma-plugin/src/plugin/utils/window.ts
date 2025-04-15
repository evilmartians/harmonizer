import type { WindowSize } from "@shared/types";

const WINDOW_SIZE_KEY = "windowSize";
export const MIN_WIDTH = 400;
export const MIN_HEIGHT = 300;
export const DEFAULT_WIDTH = 1088;
export const DEFAULT_HEIGHT = 824;

export function updateWindowSize(size: WindowSize) {
  figma.ui.resize(size.width, size.height);
  figma.clientStorage
    .setAsync(WINDOW_SIZE_KEY, size)
    .catch((error: unknown) => console.error(error));
}

export function getWindowSize(): Promise<WindowSize> {
  return figma.clientStorage.getAsync(WINDOW_SIZE_KEY).then((value) => {
    return value ? (value as WindowSize) : { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  });
}
