import { memo } from "react";

import { useSubscribe } from "@spred/react";

import { $levelIds } from "@core/stores/colors";
import { $bgLightStart } from "@core/stores/settings";
import { buildStyleString } from "@core/utils/style/buildStyleString";

import styles from "./GridCell.module.css";

/**
  This function generates CSS selectors and styles for cell backgrounds in a grid.
  It creates two sets of selectors: one for dark backgrounds and one for light backgrounds.
  The cells with dark background are coming till the `bgLightStart` column, and the light background continues from there.
  The function returns an array of tuples, each containing an array of selectors and a corresponding style string.
  The selectors are based on the number of columns in the grid, and the styles are applied to the cells using CSS custom properties.
*/
function getCellBgStyles(columns: number, bgLightStart: number): [string[], string][] {
  const darkBgSelectors: string[] = [];
  const lightBgSelectors: string[] = [];

  for (let i = 1; i <= bgLightStart; i++) {
    darkBgSelectors.push(`:where(.${styles.cell}:nth-child(${columns + 1}n+${i}))`);
  }

  for (let i = bgLightStart + 1; i <= columns; i++) {
    lightBgSelectors.push(`:where(.${styles.cell}:nth-child(${columns + 1}n+${i}))`);
  }

  return [
    [darkBgSelectors, "background-color: var(--bg-dark);"],
    [lightBgSelectors, "background-color: var(--bg-light);"],
  ];
}

export const GridStylesBg = memo(function GridStylesBg() {
  const levels = useSubscribe($levelIds);
  const bgLightStart = useSubscribe($bgLightStart);
  const bgStyles = getCellBgStyles(levels.length + 2, bgLightStart + 1);

  return <style>{bgStyles.map(([selectors, style]) => buildStyleString(selectors, style))}</style>;
});
