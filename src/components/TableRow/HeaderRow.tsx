import { Level } from "../../types/config";
import { ActionCell } from "../TableCell/ActionCell";
import { LabelsCell } from "../TableCell/LabelsCell";
import { LevelCell } from "../TableCell/LevelCell";
import styles from "./HeaderRow.module.css";

interface HeaderRowProps {
  levels: Level[];
  model: string;
  onLevelHover: (index: number | null) => void;
  onAddLevel: () => void;
}

export function HeaderRow({
  levels,
  model,
  onAddLevel,
  onLevelHover,
}: HeaderRowProps) {
  return (
    <div className={styles.container}>
      <LabelsCell onMouseEnter={() => onLevelHover(null)} />
      {levels.map((level, i) => (
        <LevelCell
          key={`header-cell-${i}`}
          model={model}
          levelName={level.name}
          contrast={level.contrast}
          chroma={level.chroma}
          mode="light"
          onMouseEnter={() => onLevelHover(i)}
        />
      ))}
      <ActionCell
        title="Add column"
        onClick={onAddLevel}
        onMouseEnter={() => onLevelHover(null)}
      />
    </div>
  );
}
