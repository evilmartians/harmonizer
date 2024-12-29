import { ColorCell } from "../TableCell/ColorCell";
import { ActionCell } from "../TableCell/ActionCell";
import { HueCell } from "../TableCell/HueCell";
import styles from "./HueRow.module.css";
import { Hue, Level, Settings } from "../../types/config";

interface HueRowProps {
  hue: Hue;
  levels: Level[];
  settings: Settings;
  onLevelHover: (index: number | null) => void;
  onRemoveHue: () => void;
}

export function HueRow({
  hue,
  levels,
  settings,
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
      {levels.map((level, i) => (
        <ColorCell
          key={`color-${i}`}
          hue={hue}
          settings={settings}
          level={level}
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
