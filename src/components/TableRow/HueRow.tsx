import { ColorCell } from "../TableCell/ColorCell";
import { ActionCell } from "../TableCell/ActionCell";
import { HueCell } from "../TableCell/HueCell";
import styles from "./HueRow.module.css";
import { Hue } from "../../types/config";
import { ColorRow } from "../../utils/colorUtils";

interface HueRowProps {
  hue: Hue;
  colorRow: ColorRow;
  onLevelHover: (index: number | null) => void;
  onRemoveHue: () => void;
}

export function HueRow({
  hue,
  colorRow,
  onLevelHover,
  onRemoveHue,
}: HueRowProps) {
  return (
    <div className={styles.container}>
      <HueCell
        name={hue.name}
        degree={hue.degree}
        onMouseEnter={() => onLevelHover(null)}
      />
      {colorRow.levels.map((color, i) => (
        <ColorCell
          key={`color-${i}`}
          color={color}
          onMouseEnter={() => onLevelHover(i)}
        />
      ))}
      <ActionCell
        title="Remove row"
        variant="remove"
        buttonClassName={styles.actionCellButton}
        onClick={onRemoveHue}
        onMouseEnter={() => onLevelHover(null)}
      />
    </div>
  );
}
