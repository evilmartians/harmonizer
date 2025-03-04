import { useSubscribe } from "@spred/react";
import { memo } from "react";

import { ActionCell } from "../TableCell/ActionCell";
import { EmptyCell } from "../TableCell/EmptyCell";

import styles from "./ActionsRow.module.css";

import { $levelIds, insertHue, getLevel, removeLevel } from "@/stores/colors";
import { $bgLightStart } from "@/stores/settings";
import { $hoveredColumn, resetHoveredColumn, setHoveredColumn } from "@/stores/ui";
import type { LevelId } from "@/types";

const HINT_ADD_HUE = "Add new color";
const HINT_REMOVE_LEVEL = "Remove color level";

const ActionCellAddHue = memo(function ActionCellAddHue() {
  return (
    <ActionCell
      title={HINT_ADD_HUE}
      variant="hue"
      mode="dark"
      onClick={() => insertHue()}
      onMouseEnter={resetHoveredColumn}
    />
  );
});

type ActionCellRemoveLevelProps = {
  levelIndex: number;
  levelId: LevelId;
  isHovered: boolean;
};

const ActionCellRemoveLevel = memo(function ActionCellRemoveLevel({
  levelIndex,
  levelId,
  isHovered,
}: ActionCellRemoveLevelProps) {
  const bgLightStart = useSubscribe($bgLightStart);
  const levelName = useSubscribe(getLevel(levelId).$name);

  return (
    <ActionCell
      key={levelId}
      title={`${HINT_REMOVE_LEVEL} “${levelName}”`}
      variant="remove"
      mode={levelIndex >= bgLightStart ? "light" : "dark"}
      buttonClassName={isHovered ? "opacity-100" : "opacity-0"}
      onClick={() => removeLevel(levelId)}
      onMouseEnter={() => setHoveredColumn(levelIndex)}
    />
  );
});

export function ActionsRow() {
  const levelIds = useSubscribe($levelIds);
  const hoveredColumn = useSubscribe($hoveredColumn);

  return (
    <div className={styles.container}>
      <ActionCellAddHue />
      {levelIds.map((levelId, i) => (
        <ActionCellRemoveLevel
          key={levelId}
          levelIndex={i}
          levelId={levelId}
          isHovered={hoveredColumn === i}
        />
      ))}
      <EmptyCell onMouseEnter={resetHoveredColumn} />
    </div>
  );
}
