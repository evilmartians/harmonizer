import { Level } from "../../types/config";
import { ActionCell } from "../TableCell/ActionCell";
import { EmptyCell } from "../TableCell/EmptyCell";
import styles from "./ActionsRow.module.css";

interface ActionsRowProps {
  levels: Level[];
  onAddHue: () => void;
  hoveredColumn: number | null;
  onColumnHover: (index: number | null) => void;
  onRemoveLevel: (name: string) => void;
}

export function ActionsRow({
  levels,
  onAddHue,
  hoveredColumn,
  onRemoveLevel,
  onColumnHover,
}: ActionsRowProps) {
  return (
    <div className={styles.container}>
      <ActionCell
        className={styles.addButton}
        title="Add row"
        variant="row"
        isVisible={true}
        onClick={onAddHue}
        onMouseEnter={() => onColumnHover(null)}
      />
      {levels.map((level, i) => (
        <ActionCell
          key={`action-${i}`}
          title="Remove column"
          variant="remove"
          isVisible={hoveredColumn === i}
          onClick={() => onRemoveLevel(level.name)}
          onMouseEnter={() => onColumnHover(i)}
        />
      ))}
      <EmptyCell />
    </div>
  );
}
