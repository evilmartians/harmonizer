import { useSubscribe } from "@spred/react";

import { TextControl } from "../TextControl/TextControl";

import styles from "./HueCell.module.css";
import { TableCell } from "./TableCell";

import { getHue, updateHueAngle, updateHueName } from "@/stores/colors";
import type { HueAngle, HueId } from "@/types";

const PLACEHOLDER_NAME = "Name";
const PLACEHOLDER_HUE = "Hue";

const HINT_NAME = "Color name";
const HINT_DEGREE = "Hue 0…360";

const ERROR_INVALID_HUE = "Hue must be a number 0…360";

type HueCellProps = {
  hueId: HueId;
  onMouseEnter: () => void;
};

function validateHue(val: string): string | null {
  const regExp = /^[0-9]+$/;
  const number = Number.parseFloat(val);
  if (!regExp.test(val) || Number.isNaN(number) || number < 0 || number > 360) {
    return ERROR_INVALID_HUE;
  }
  return null;
}

export function HueCell({ hueId, onMouseEnter }: HueCellProps) {
  const hue = getHue(hueId);
  const name = useSubscribe(hue.$name);
  const angle = useSubscribe(hue.$angle);
  const tintColor = useSubscribe(hue.$tintColor);

  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        {/* <span className={styles.label}>{name}</span> */}
        <TextControl
          className={styles.nameInput}
          inputSize="m"
          kind="ghost"
          align="left"
          tintColor={tintColor}
          placeholder={PLACEHOLDER_NAME}
          value={name}
          title={HINT_NAME}
          onValidEdit={(value) => updateHueName(hueId, value)}
        />
        <TextControl
          className={styles.angleInput}
          inputSize="m"
          kind="ghost"
          align="left"
          placeholder={PLACEHOLDER_HUE}
          value={angle}
          title={HINT_DEGREE}
          validator={validateHue}
          onValidEdit={(value) => updateHueAngle(hueId, Number.parseFloat(value) as HueAngle)}
        />
      </div>
    </TableCell>
  );
}
