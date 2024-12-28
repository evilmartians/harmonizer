import { TableCell } from "./TableCell";
import styles from "./ColorCell.module.css";

interface ColorCellProps {
  color: string;
  onMouseEnter: () => void;
}

export function ColorCell({ color, onMouseEnter }: ColorCellProps) {
  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>{color}</div>
    </TableCell>
  );
}
