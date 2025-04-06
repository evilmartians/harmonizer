import { $levelIds } from "@core/stores/colors";
import { $bgLightStart } from "@core/stores/settings";
import { buildStyleString } from "@core/utils/style/buildStyleString";
import { useSubscribe } from "@spred/react";
import { memo } from "react";

import styles from "./GridCell.module.css";

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
