import { TableCell } from "./TableCell";
import styles from "./HueCell.module.css";
import { TextControl } from "../TextControl/TextControl";
import { Color } from "../../utils/colorUtils";

const PLACEHOLDER_NAME = "Name";
const PLACEHOLDER_HUE = "Hue";

const HINT_NAME = "Color name";
const HINT_DERGEE = "Hue 0…360";

interface HueCellProps {
  name: string;
  degree: number;
  tint: Color;
  onMouseEnter: () => void;
  onEdit: (name: string, degree: number) => void;
}

export function HueCell({
  name,
  degree,
  tint,
  onMouseEnter,
  onEdit,
}: HueCellProps) {
  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        {/* <span className={styles.label}>{name}</span> */}
        <TextControl
          className={styles.nameInput}
          inputSize="m"
          kind="ghost"
          align="left"
          tint={tint}
          placeholder={PLACEHOLDER_NAME}
          value={name}
          title={HINT_NAME}
          onChange={(e) => onEdit(e.target.value, degree)}
        ></TextControl>
        <TextControl
          className={styles.degreeInput}
          inputSize="m"
          kind="ghost"
          align="left"
          placeholder={PLACEHOLDER_HUE}
          value={degree}
          title={HINT_DERGEE}
          onChange={(e) => onEdit(name, parseFloat(e.target.value))}
        ></TextControl>
      </div>
    </TableCell>
  );
}
