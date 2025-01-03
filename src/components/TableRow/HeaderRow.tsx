import { Level } from "../../types/config";
import { ColorRow } from "../../utils/colorUtils";
import { ActionCell } from "../TableCell/ActionCell";
import { LabelsCell } from "../TableCell/LabelsCell";
import { LevelCell } from "../TableCell/LevelCell";
import styles from "./HeaderRow.module.css";

const HINT_ADD_LEVEL = "Add new color level";

interface HeaderRowProps {
  levels: Level[];
  model: string;
  tints: ColorRow;
  lightLevel: number;
  editableChroma: boolean;
  onLevelHover: (index: number | null) => void;
  onAddLevel: () => void;
  onLevelHue: (index: number, level: Level) => void;
}

export function HeaderRow({
  levels,
  model,
  tints,
  lightLevel,
  editableChroma,
  onAddLevel,
  onLevelHover,
  onLevelHue,
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
          chroma={tints.levels[i].c}
          mode={i >= lightLevel ? "light" : "dark"}
          tint={tints.levels[i]}
          editableChroma={editableChroma}
          onMouseEnter={() => onLevelHover(i)}
          onEdit={(name, contrast, chroma) =>
            onLevelHue(i, { name, contrast, chroma } as Level)
          }
        />
      ))}
      <ActionCell
        title={HINT_ADD_LEVEL}
        mode="light"
        onClick={onAddLevel}
        onMouseEnter={() => onLevelHover(null)}
      />
    </div>
  );
}
