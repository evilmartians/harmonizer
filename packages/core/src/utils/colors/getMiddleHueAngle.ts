import type { HueAngle } from "@core/types";

import { getMiddleNumber } from "../number/getMiddleNumber";

/**
 * Calculates the middle hue angle between two given hue angles. The order of the hue angles does not matter.
 *
 * @param hueAngle1 - The first hue angle.
 * @param hueAngle2 - The second hue angle.
 * @returns The middle hue angle.
 */

export const getMiddleHueAngle = getMiddleNumber<HueAngle>;
