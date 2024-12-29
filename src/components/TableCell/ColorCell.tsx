import { TableCell } from "./TableCell";
import styles from "./ColorCell.module.css";
import { Hue, Level, Settings } from "../../types/config";
import { useMemo } from "react";
import { calculateColor } from "../../utils/colorUtils";

interface ColorCellProps {
  hue: Hue;
  level: Level;
  settings: Settings;
  onMouseEnter: () => void;
}

export function ColorCell({
  hue,
  level,
  settings,
  onMouseEnter,
}: ColorCellProps) {
  const backgroundColor = useMemo(
    () => calculateColor(hue, level, settings),
    [hue, level, settings]
  );
  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container} style={{ backgroundColor }}>
        {hue.name}-{level.name}
      </div>
    </TableCell>
  );
}
