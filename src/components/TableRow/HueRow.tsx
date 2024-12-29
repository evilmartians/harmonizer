import { ColorCell } from "../TableCell/ColorCell";
import { ActionCell } from "../TableCell/ActionCell";
import { HueCell } from "../TableCell/HueCell";
import styles from "./HueRow.module.css";
import { useState } from "react";
import { Hue, Level } from "../../types/config";

interface HueRowProps {
  hue: Hue;
  levels: Level[];
  onLevelHover: (index: number | null) => void;
  onRemoveHue: () => void;
}

export function HueRow({
  hue,
  levels,
  onLevelHover,
  onRemoveHue,
}: HueRowProps) {
  const [actionIsVisible, setActionIsVisible] = useState(false);
  return (
    <div
      onMouseEnter={() => setActionIsVisible(true)}
      onMouseLeave={() => setActionIsVisible(false)}
      className={styles.container}
    >
      <HueCell
        name={hue.name}
        degree={hue.degree}
        onMouseEnter={() => onLevelHover(null)}
      />
      {levels.map((level, i) => (
        <ColorCell
          key={`color-${i}`}
          color="#???"
          onMouseEnter={() => onLevelHover(i)}
        />
      ))}
      <ActionCell
        title="Remove row"
        variant="remove"
        isVisible={actionIsVisible}
        onClick={onRemoveHue}
        onMouseEnter={() => onLevelHover(null)}
      />
    </div>
  );
}
