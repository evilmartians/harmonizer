import { TableCell } from "./TableCell";
import styles from "./LevelCell.module.css";
import { TextControl } from "../TextControl/TextControl";
import classNames from "classnames";
import { Color } from "../../utils/colorUtils";

const PLACEHOLDER_LEVEL = "Level";
const PLACEHOLDER_CONTRAST = "CR";
const PLACEHOLDER_CHROMA = "Chroma";

const HINT_LEVEL = "Color level name";
const HINT_CONTRAST = "Contrast between color and background";
const HINT_CHROMA = "Chroma of all colors in this column";

interface LevelCellProps {
  levelName: string;
  model: string;
  contrast: number;
  chroma: number;
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
          onChange={(e) => onEdit(e.target.value, contrast, chroma)}
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
          onChange={(e) =>
            onEdit(levelName, parseFloat(e.target.value), chroma)
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
          onChange={(e) =>
            onEdit(levelName, contrast, parseFloat(e.target.value))
          }
        />
      </div>
    </TableCell>
  );
}
