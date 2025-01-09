import { ensureNonNullable } from "@/utils/ensureNonNullable";
import type { Level } from "../../types/config";
import type { ColorRow } from "../../utils/color";
import { ActionCell } from "../TableCell/ActionCell";
import { LabelsCell } from "../TableCell/LabelsCell";
import { LevelCell } from "../TableCell/LevelCell";
import styles from "./HeaderRow.module.css";

const HINT_ADD_LEVEL = "Add new color level";

interface HeaderRowProps {
  levels: Level[];
  model: string;
  tints: ColorRow;
  bgLightLevel: number;
  editableChroma: boolean;
  onLevelHover: (index: number | null) => void;
  onAddLevel: () => void;
  onLevelHue: (index: number, level: Level) => void;
}

export function HeaderRow({
  levels,
  model,
  tints,
  bgLightLevel,
  editableChroma,
  onAddLevel,
  onLevelHover,
  onLevelHue,
}: HeaderRowProps) {
  return (
    <div className={styles.container}>
      <LabelsCell onMouseEnter={() => onLevelHover(null)} />
      {levels.map((level, i) => {
        const tintLevel = ensureNonNullable(
          tints.levels[i],
          "Tint level not found",
        );

        return (
          <LevelCell
            key={`header-cell-${level.name}-${level.contrast}-${level.chroma}-${i}`}
            model={model}
            levelName={level.name}
            contrast={level.contrast}
            chroma={tintLevel.c}
            mode={i >= bgLightLevel ? "light" : "dark"}
            tint={tintLevel}
            editableChroma={editableChroma}
            onMouseEnter={() => onLevelHover(i)}
            onEdit={(name, contrast, chroma) =>
              onLevelHue(i, { name, contrast, chroma } as Level)
            }
          />
        );
      })}
      <ActionCell
        title={HINT_ADD_LEVEL}
        variant="level"
        mode="light"
        onClick={onAddLevel}
        onMouseEnter={() => onLevelHover(null)}
      />
    </div>
  );
}
