import { TableCell } from "./TableCell";
import styles from "./HueCell.module.css";
import { TextControl } from "../TextControl/TextControl";

const PLACEHOLDER_HUE = "Hue";

interface HueCellProps {
  title: string;
  hue: string;
  onMouseEnter: () => void;
}

export function HueCell({ title, hue, onMouseEnter }: HueCellProps) {
  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        <span className={styles.label}>{title}</span>
        <TextControl
          inputClassName={styles.input}
          inputSize="m"
          kind="ghost"
          align="left"
          placeholder={PLACEHOLDER_HUE}
          value="some"
        ></TextControl>
      </div>
    </TableCell>
  );
}
