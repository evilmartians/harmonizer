import { TableCell } from "./TableCell";
import styles from "./HueCell.module.css";
import { TextControl } from "../TextControl/TextControl";

const PLACEHOLDER_HUE = "Hue";

interface HueCellProps {
  name: string;
  degree: number;
  onMouseEnter: () => void;
}

export function HueCell({ name, degree, onMouseEnter }: HueCellProps) {
  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        <span className={styles.label}>{name}</span>
        <TextControl
          inputClassName={styles.input}
          inputSize="m"
          kind="ghost"
          align="left"
          placeholder={PLACEHOLDER_HUE}
          value={degree}
        ></TextControl>
      </div>
    </TableCell>
  );
}
