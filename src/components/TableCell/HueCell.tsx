import type { Color } from "../../utils/color";
import { TextControl } from "../TextControl/TextControl";

import styles from "./HueCell.module.css";
import { TableCell } from "./TableCell";

const PLACEHOLDER_NAME = "Name";
const PLACEHOLDER_HUE = "Hue";

const HINT_NAME = "Color name";
const HINT_DERGEE = "Hue 0…360";

const ERROR_INVALID_HUE = "Hue must be a number 0…360";

type HueCellProps = {
  name: string;
  angle: number;
  tint: Color;
  onMouseEnter: () => void;
  onEdit: (name: string, angle: number) => void;
};

function validateHue(val: string): string | null {
  const regExp = /^[0-9]+$/;
  const number = Number.parseFloat(val);
  if (!regExp.test(val) || Number.isNaN(number) || number < 0 || number > 360) {
    return ERROR_INVALID_HUE;
  }
  return null;
}

export function HueCell({ name, angle, tint, onMouseEnter, onEdit }: HueCellProps) {
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
          onValidEdit={(e) => onEdit(e, angle)}
        />
        <TextControl
          className={styles.angleInput}
          inputSize="m"
          kind="ghost"
          align="left"
          placeholder={PLACEHOLDER_HUE}
          value={angle}
          title={HINT_DERGEE}
          validator={validateHue}
          onValidEdit={(e) => onEdit(name, Number.parseFloat(e))}
        />
      </div>
    </TableCell>
  );
}
