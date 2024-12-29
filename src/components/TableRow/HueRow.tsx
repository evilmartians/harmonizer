import { ColorCell } from "../TableCell/ColorCell";
import { ActionCell } from "../TableCell/ActionCell";
import { HueCell } from "../TableCell/HueCell";
import styles from "./HueRow.module.css";
import { useCallback, useState } from "react";
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
          color="#???"
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
