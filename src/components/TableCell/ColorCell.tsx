import classNames from "classnames";
import type { Color } from "../../utils/color";
import styles from "./ColorCell.module.css";
import { TableCell } from "./TableCell";

interface ColorCellProps {
  color: Color;
  mode: "light" | "dark";
  onMouseEnter: VoidFunction;
}

export function ColorCell({ color, mode, onMouseEnter }: ColorCellProps) {
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
      <div className={classNames(styles.container, styles[`mode_${mode}`])}>
        <div className={styles.topLine}>
          <span className={styles.lightnessLabel}>L{lightness}%</span>
          <span
            className={styles.p3Badge}
            style={{ opacity: color.p3 ? 100 : 0 }}
          >
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
}
