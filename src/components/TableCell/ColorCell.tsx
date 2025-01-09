import { TableCell } from "./TableCell";
import styles from "./ColorCell.module.css";
import { Color } from "../../utils/color";
import classNames from "classnames";

interface ColorCellProps {
  color: Color;
  mode: "light" | "dark";
  onMouseEnter: () => void;
}

export function ColorCell({ color, mode, onMouseEnter }: ColorCellProps) {
  const backgroundColor = color.css;
  return (
    <TableCell style={{ backgroundColor }} onMouseEnter={onMouseEnter}>
      <div className={classNames(styles.container, styles[`mode_${mode}`])}>
        <div className={styles.topLine}>
          <span className={styles.lightnessLabel}>L{color.l}%</span>
          <span
            className={styles.p3Badge}
            style={{ opacity: color.p3 ? 100 : 0 }}
          >
            P3
          </span>
        </div>
        <div className={styles.middleLine}>{color.cr}</div>
        <div className={styles.bottomLine}>
          <span>C{color.c}</span>
          <span>H{color.h}</span>
        </div>
      </div>
    </TableCell>
  );
}
