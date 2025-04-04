import type { LevelContrast } from "@core/types";

import { getMiddleNumber } from "../number/getMiddleNumber";

/**
 * Calculates the middle contrast level between two given contrast levels. The order of the contrast levels does not matter.
 *
 * @param contrast1 - The first contrast level.
 * @param contrast2 - The second contrast level.
 * @returns The middle contrast level.
 */

export const getMiddleContrastLevel = getMiddleNumber<LevelContrast>;
