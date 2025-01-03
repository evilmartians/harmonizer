import { Level } from "../../types/config";
import { ActionCell } from "../TableCell/ActionCell";
import { EmptyCell } from "../TableCell/EmptyCell";
import styles from "./ActionsRow.module.css";

interface ActionsRowProps {
  levels: Level[];
  lightLevel: number;
  hoveredColumn: number | null;
  onAddHue: () => void;
  onColumnHover: (index: number | null) => void;
  onRemoveLevel: (name: string) => void;
}

export function ActionsRow({
  levels,
  lightLevel,
  hoveredColumn,
  onAddHue,
  onRemoveLevel,
  onColumnHover,
}: ActionsRowProps) {
  return (
    <div className={styles.container}>
      <ActionCell
        className={styles.addButton}
        title="Add row"
        variant="row"
        mode="dark"
        onClick={onAddHue}
        onMouseEnter={() => onColumnHover(null)}
      />
      {levels.map((level, i) => (
        <ActionCell
          key={`action-${i}`}
          title="Remove column"
          variant="remove"
          mode={i >= lightLevel ? "light" : "dark"}
          buttonClassName={hoveredColumn === i ? "opacity-100" : "opacity-0"}
          onClick={() => onRemoveLevel(level.name)}
          onMouseEnter={() => onColumnHover(i)}
        />
      ))}
      <EmptyCell onMouseEnter={() => onColumnHover(null)} />
    </div>
  );
}
