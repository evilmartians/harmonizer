import classNames from "classnames";
import type { Color } from "../../utils/color";
import { TextControl } from "../TextControl/TextControl";
import styles from "./LevelCell.module.css";
import { TableCell } from "./TableCell";

const PLACEHOLDER_LEVEL = "Level";
const PLACEHOLDER_CONTRAST = "CR";
const PLACEHOLDER_CHROMA = "Chroma";

const HINT_LEVEL = "Color level name";
const HINT_CONTRAST = "Contrast between color and background";
const HINT_CHROMA = "Chroma of all colors in this column";

const ERROR_INVALID_CONTRAST = "Contrast must be a number 0…108";
const ERROR_INVALID_CHROMA = "Chroma must be a number 0…0.37";

interface LevelCellProps {
  levelName: string;
  model: string;
  contrast: number;
  chroma: string;
  mode: "light" | "dark";
  tint: Color;
  editableChroma: boolean;
  onMouseEnter: () => void;
  onEdit: (name: string, contrast: number, chroma: number) => void;
}

export function LevelCell({
  levelName,
  model,
  contrast,
  chroma,
  mode,
  tint,
  editableChroma,
  onMouseEnter,
  onEdit,
}: LevelCellProps) {
  function validateContrast(val: string): string | null {
    const regExp = /^[0-9]+$/;
    const number = Number.parseFloat(val);
    if (
      !regExp.test(val) ||
      Number.isNaN(number) ||
      number < 0 ||
      number > 108
    ) {
      return ERROR_INVALID_CONTRAST;
    }
    return null;
  }

  function validateChroma(val: string): string | null {
    const regExp = /^[0-9]+$/;
    const number = Number.parseFloat(val);
    console.log("validate chroma", number);
    if (
      !regExp.test(val) ||
      Number.isNaN(number) ||
      number < 0 ||
      number > 0.37
    ) {
      return ERROR_INVALID_CHROMA;
    }
    return null;
  }

  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        <TextControl
          className={classNames(styles.inputSecondary, styles[`mode_${mode}`])}
          inputSize="m"
          kind="ghost"
          placeholder={PLACEHOLDER_LEVEL}
          value={levelName}
          title={HINT_LEVEL}
          onValidEdit={(e) => onEdit(e, contrast, Number.parseFloat(chroma))}
        />
        <TextControl
          className={classNames(styles.inputPrimary, styles[`mode_${mode}`])}
          inputSize="l"
          kind="bordered"
          tint={tint}
          placeholder={PLACEHOLDER_CONTRAST}
          value={contrast}
          label={model}
          title={HINT_CONTRAST}
          validator={validateContrast}
          onValidEdit={(e) =>
            onEdit(levelName, Number.parseFloat(e), Number.parseFloat(chroma))
          }
        />
        <TextControl
          className={classNames(styles.inputSecondary, styles[`mode_${mode}`])}
          inputSize="m"
          kind="ghost"
          placeholder={PLACEHOLDER_CHROMA}
          value={chroma}
          title={HINT_CHROMA}
          disabled={!editableChroma}
          validator={validateChroma}
          onValidEdit={(e) => onEdit(levelName, contrast, Number.parseFloat(e))}
        />
      </div>
    </TableCell>
  );
}
