import { useSubscribe } from "@spred/react";
import { memo, useCallback } from "react";

import { DATA_ATTR_CELL_LEVEL_ID } from "./constants";
import { GridCellRemoveAxis } from "./GridCellRemoveAxis";

import { getLevel, removeLevel } from "@/stores/colors";
import { useLevelBgMode } from "@/stores/hooks";
import type { LevelId } from "@/types";

export type GridCellLevelRemoveProps = {
  levelId: LevelId;
  levelIndex: number;
};

export const GridCellLevelRemove = memo(function GridCellLevelRemove({
  levelId,
  levelIndex,
}: GridCellLevelRemoveProps) {
  const bgMode = useLevelBgMode(levelIndex);
  const level = getLevel(levelId);
  const name = useSubscribe(level.$name);
  const handleClick = useCallback(() => removeLevel(levelId), [levelId]);

  return (
    <GridCellRemoveAxis
      bgMode={bgMode}
      {...{ [DATA_ATTR_CELL_LEVEL_ID]: levelId }}
      onClick={handleClick}
      aria-label={`Delete level column with name: ${name}`}
    />
  );
});
