import { useSubscribe } from "@spred/react";
import clsx from "clsx";
import { memo } from "react";

import styles from "./ColorCell.module.css";
import { TableCell } from "./TableCell";

import { getColor$ } from "@/stores/colors";
import type { HueId, LevelId } from "@/types";

type ColorCellProps = {
  mode: "light" | "dark";
  levelId: LevelId;
  hueId: HueId;
  onMouseEnter: VoidFunction;
};

export const ColorCell = memo(function ColorCell({
  mode,
  levelId,
  hueId,
  onMouseEnter,
}: ColorCellProps) {
  const color = useSubscribe(getColor$(levelId, hueId));
  const backgroundColor = color.css;
  const onClick = () => {
    const url = `https://oklch.com/#${color.l * 100},${color.c},${color.h},100`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const lightness = Number.parseFloat((color.l * 100).toFixed(2));
  const chroma = Number.parseFloat(color.c.toFixed(2));
  const hue = color.h;
  return (
    <TableCell
      className="cursor-pointer"
      style={{ backgroundColor }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className={clsx(styles.container, styles[`mode_${mode}`])}>
        <div className={styles.topLine}>
          <span className={styles.lightnessLabel}>L{lightness}%</span>
          <span className={styles.p3Badge} style={{ opacity: color.p3 ? 100 : 0 }}>
            P3
          </span>
        </div>
        <div className={styles.middleLine}>{color.cr}</div>
        <div className={styles.bottomLine}>
          <span>C{chroma}</span>
          <span>H{hue}</span>
        </div>
      </div>
    </TableCell>
  );
});
