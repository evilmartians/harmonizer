import { TableCell } from "./TableCell";
import styles from "./ColorCell.module.css";
import { Color } from "../../utils/colorUtils";

interface ColorCellProps {
  color: Color;
  onMouseEnter: () => void;
}

export function ColorCell({ color, onMouseEnter }: ColorCellProps) {
  const backgroundColor = color.css;
  return (
    <TableCell style={{ backgroundColor }} onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
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
