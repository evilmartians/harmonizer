import { ActionCell } from "../TableCell/ActionCell";
import { LabelsCell } from "../TableCell/LabelsCell";
import { LevelCell } from "../TableCell/LevelCell";
import styles from "./HeaderRow.module.css";

interface HeaderRowProps {
  cols: number[];
  onColumnHover: (index: number | null) => void;
  onAddColumn: () => void;
}

export function HeaderRow({
  cols,
  onAddColumn,
  onColumnHover,
}: HeaderRowProps) {
  return (
    <div className={styles.container}>
      <LabelsCell onMouseEnter={() => onColumnHover(null)} />
      {cols.map((colIndex) => (
        <LevelCell
          key={`header-cell-${colIndex}`}
          model="APCA"
          level={`${colIndex}`}
          contrast={50}
          chroma={0.1}
          onMouseEnter={() => onColumnHover(colIndex)}
        />
      ))}
      <ActionCell
        title="Add column"
        onClick={onAddColumn}
        onMouseEnter={() => onColumnHover(null)}
      />
    </div>
  );
}
