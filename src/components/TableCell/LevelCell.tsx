import { TableCell } from "./TableCell";
import styles from "./LevelCell.module.css";
import { TextControl } from "../TextControl/TextControl";

const PLACEHOLDER_LEVEL = "Level";
const PLACEHOLDER_CONTRAST = "Contrast";
const PLACEHOLDER_CHROMA = "Chroma";

interface LevelCellProps {
  levelName: string;
  model: string;
  contrast: number;
  chroma: number;
  onMouseEnter: () => void;
}

export function LevelCell({
  levelName,
  model,
  contrast,
  chroma,
  onMouseEnter,
}: LevelCellProps) {
  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        <TextControl
          inputSize="m"
          kind="ghost"
          placeholder={PLACEHOLDER_LEVEL}
          value={levelName}
        />
        <TextControl
          inputSize="l"
          kind="bordered"
          placeholder={PLACEHOLDER_CONTRAST}
          value={contrast}
          label={model}
        />
        <TextControl
          inputSize="m"
          kind="ghost"
          placeholder={PLACEHOLDER_CHROMA}
          value={chroma}
        />
      </div>
    </TableCell>
  );
}
