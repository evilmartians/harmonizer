import { ActionCell } from "../TableCell/ActionCell";
import { EmptyCell } from "../TableCell/EmptyCell";
import styles from "./ActionsRow.module.css";

interface ActionsRowProps {
  cols: number[];
  onAddRow: () => void;
  hoveredColumn: number | null;
  onColumnHover: (index: number | null) => void;
  onRemoveColumn: (colIndex: number) => void;
}

export function ActionsRow({
  cols,
  onAddRow,
  hoveredColumn,
  onRemoveColumn,
  onColumnHover,
}: ActionsRowProps) {
  return (
    <div className={styles.container}>
      <ActionCell
        className={styles.addButton}
        title="Add row"
        variant="row"
        isVisible={true}
        onClick={onAddRow}
        onMouseEnter={() => onColumnHover(null)}
      />
      {cols.map((colIndex) => (
        <ActionCell
          title="Remove column"
          variant="remove"
          isVisible={hoveredColumn === colIndex}
          onClick={() => onRemoveColumn(colIndex)}
          onMouseEnter={() => onColumnHover(colIndex)}
        />
      ))}
      <EmptyCell />
    </div>
  );
}
