import { useSubscribe } from "@spred/react";
import { memo } from "react";

import styles from "./GridCell.module.css";

import { $levelIds } from "@/stores/colors";
import { $bgLightStart } from "@/stores/settings";
import { buildStyle } from "@/utils/styles";

function getCellBgStyles(columns: number, bgLightStart: number): [string[], string][] {
  const darkBgSelectors: string[] = [];
  const lightBgSelectors: string[] = [];

  for (let i = 1; i <= bgLightStart; i++) {
    darkBgSelectors.push(`.${styles.cell}:nth-child(${columns + 1}n+${i})`);
  }

  for (let i = bgLightStart + 1; i <= columns; i++) {
    lightBgSelectors.push(`.${styles.cell}:nth-child(${columns + 1}n+${i})`);
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

  return <style>{bgStyles.map(([selectors, style]) => buildStyle(selectors, style))}</style>;
});
