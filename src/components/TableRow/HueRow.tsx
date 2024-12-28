import { ColorCell } from "../TableCell/ColorCell";
import { ActionCell } from "../TableCell/ActionCell";
import { HueCell } from "../TableCell/HueCell";
import styles from "./HueRow.module.css";
import { useState } from "react";

interface HueRowProps {
  rowIndex: number;
  cols: number[];
  onColumnHover: (index: number | null) => void;
  onRemoveRow: () => void;
}

export function HueRow({
  rowIndex,
  cols,
  onColumnHover,
  onRemoveRow,
}: HueRowProps) {
  const [actionIsVisible, setActionIsVisible] = useState(false);
  return (
    <div
      onMouseEnter={() => setActionIsVisible(true)}
      onMouseLeave={() => setActionIsVisible(false)}
      className={styles.container}
    >
      <HueCell
        title="red"
        hue={`${rowIndex}`}
        onMouseEnter={() => onColumnHover(null)}
      />
      {cols.map((colIndex) => (
        <ColorCell
          key={`cell-${rowIndex}-${colIndex}`}
          color="#???"
          onMouseEnter={() => onColumnHover(colIndex)}
        />
      ))}
      <ActionCell
        title="Remove row"
        variant="remove"
        isVisible={actionIsVisible}
        onClick={onRemoveRow}
        onMouseEnter={() => onColumnHover(null)}
      />
    </div>
  );
}
