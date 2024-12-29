import { TableCell } from "./TableCell";
import styles from "./LevelCell.module.css";
import { TextControl } from "../TextControl/TextControl";
import classNames from "classnames";

const PLACEHOLDER_LEVEL = "Level";
const PLACEHOLDER_CONTRAST = "Contrast";
const PLACEHOLDER_CHROMA = "Chroma";

interface LevelCellProps {
  levelName: string;
  model: string;
  contrast: number;
  chroma: number;
  mode: "light" | "dark";
  onMouseEnter: () => void;
}

export function LevelCell({
  levelName,
  model,
  contrast,
  chroma,
  mode,
  onMouseEnter,
}: LevelCellProps) {
  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        <TextControl
          inputClassName={classNames(
            styles.inputSecondary,
            styles[`mode_${mode}`]
          )}
          inputSize="m"
          kind="ghost"
          placeholder={PLACEHOLDER_LEVEL}
          value={levelName}
        />
        <TextControl
          inputClassName={classNames(
            styles.inputPrimary,
            styles[`mode_${mode}`]
          )}
          inputSize="l"
          kind="bordered"
          placeholder={PLACEHOLDER_CONTRAST}
          value={contrast}
          label={model}
        />
        <TextControl
          inputClassName={classNames(
            styles.inputSecondary,
            styles[`mode_${mode}`]
          )}
          inputSize="m"
          kind="ghost"
          placeholder={PLACEHOLDER_CHROMA}
          value={chroma}
        />
      </div>
    </TableCell>
  );
}
