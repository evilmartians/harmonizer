import { ensureNonNullable } from "@/utils/ensureNonNullable";
import { useMemo } from "react";
import type { Level, Settings } from "../../types/config";
import { type ColorRow, adjustCr, getBgColor } from "../../utils/color";
import { ActionCell } from "../TableCell/ActionCell";
import { LabelsCell } from "../TableCell/LabelsCell";
import { LevelCell } from "../TableCell/LevelCell";
import styles from "./HeaderRow.module.css";

const HINT_ADD_LEVEL = "Add new color level";
const MIN_CR = 50;

interface HeaderRowProps {
  settings: Settings;
  levels: Level[];
  model: string;
  tints: ColorRow;
  bgLightLevel: number;
  editableChroma: boolean;
  onLevelHover: (index: number | null) => void;
  onEditModel: (value: string) => void;
  onEditDirection: (value: string) => void;
  onEditChroma: (value: string) => void;
  onAddLevel: () => void;
  onLevelHue: (index: number, level: Level) => void;
}

export function HeaderRow({
  settings,
  levels,
  model,
  tints,
  bgLightLevel,
  editableChroma,
  onAddLevel,
  onEditModel,
  onEditDirection,
  onEditChroma,
  onLevelHover,
  onLevelHue,
}: HeaderRowProps) {
  return (
    <div className={styles.container}>
      <LabelsCell
        model={settings.model}
        direction={settings.direction}
        chroma={settings.chroma}
        onMouseEnter={() => onLevelHover(null)}
        onEditModel={onEditModel}
        onEditDirection={onEditDirection}
        onEditChroma={onEditChroma}
      />
      {levels.map((level, i) => {
        const invertedColor = i < bgLightLevel;
        const tintLevel = ensureNonNullable(
          tints.levels[i],
          "Tint level not found",
        );

        function tintColor() {
          return tintLevel.cr >= MIN_CR
            ? tintLevel
            : adjustCr(
                tintLevel,
                getBgColor(settings, i),
                MIN_CR,
                settings.colorSpace,
              );
        }

        const chroma = useMemo(() => {
          return settings.chroma === "even"
            ? `${tintLevel.c.toFixed(2)}`
            : "max";
        }, [settings.chroma, tintLevel.c]);

        return (
          <LevelCell
            key={`header-cell-${level.name}-${level.contrast}-${level.chroma}-${i}-${settings.chroma}`}
            model={model}
            levelName={level.name}
            contrast={level.contrast}
            chroma={chroma}
            mode={invertedColor ? "dark" : "light"}
            tint={tintColor()}
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
