import { ColorCell } from "../TableCell/ColorCell";
import { ActionCell } from "../TableCell/ActionCell";
import { HueCell } from "../TableCell/HueCell";
import styles from "./HueRow.module.css";
import { Hue } from "../../types/config";
import { ColorRow } from "../../utils/colorUtils";

const HINT_REMOVE_HUE = "Remove color";

interface HueRowProps {
  hue: Hue;
  colorRow: ColorRow;
  lightLevel: number;
  onLevelHover: (index: number | null) => void;
  onRemoveHue: () => void;
  onEditHue: (hue: Hue) => void;
}

export function HueRow({
  hue,
  colorRow,
  lightLevel,
  onLevelHover,
  onRemoveHue,
  onEditHue,
}: HueRowProps) {
  const tint = colorRow.levels[Math.floor(colorRow.levels.length / 4)];
  return (
    <div className={styles.container}>
      <HueCell
        name={hue.name}
        degree={hue.degree}
        tint={tint}
        onMouseEnter={() => onLevelHover(null)}
        onEdit={(name, degree) => onEditHue({ name, degree } as Hue)}
      />
      {colorRow.levels.map((color, i) => (
        <ColorCell
          key={`color-${color.css}-${i}`}
          color={color}
          mode={i < lightLevel ? "light" : "dark"}
          onMouseEnter={() => onLevelHover(i)}
        />
      ))}
      <ActionCell
        title={`${HINT_REMOVE_HUE} “${hue.name}”`}
        variant="remove"
        mode="light"
        buttonClassName={styles.actionCellButton}
        onClick={onRemoveHue}
        onMouseEnter={() => onLevelHover(null)}
      />
    </div>
  );
}
