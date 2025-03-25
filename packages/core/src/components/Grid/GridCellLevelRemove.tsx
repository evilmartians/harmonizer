import { getLevel, removeLevel } from "@core/stores/colors";
import { useLevelBgMode } from "@core/stores/hooks";
import type { LevelId, LevelIndex } from "@core/types";
import { useSubscribe } from "@spred/react";
import { memo, useCallback } from "react";

import { DATA_ATTR_CELL_LEVEL_ID } from "./constants";
import { GridCellRemoveAxis } from "./GridCellRemoveAxis";

export type GridCellLevelRemoveProps = {
  levelId: LevelId;
  levelIndex: LevelIndex;
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
