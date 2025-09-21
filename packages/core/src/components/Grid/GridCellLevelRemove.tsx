import { memo, useCallback } from "react";

import { useSubscribe } from "@spred/react";

import { getLevel, removeLevel } from "@core/stores/colors";
import { useLevelBgColorType, useLevelBgMode } from "@core/stores/hooks";
import type { LevelId } from "@core/types";

import { DATA_ATTR_CELL_LEVEL_ID } from "./constants";
import { GridCellRemoveAxis } from "./GridCellRemoveAxis";

export type GridCellLevelRemoveProps = {
  levelId: LevelId;
};

export const GridCellLevelRemove = memo(function GridCellLevelRemove({
  levelId,
}: GridCellLevelRemoveProps) {
  const bgColorType = useLevelBgColorType(levelId);
  const bgMode = useLevelBgMode(levelId);
  const level = getLevel(levelId);
  const name = useSubscribe(level.name.$raw);
  const handleClick = useCallback(() => removeLevel(levelId), [levelId]);

  return (
    <GridCellRemoveAxis
      bgColorType={bgColorType}
      bgMode={bgMode}
      {...{ [DATA_ATTR_CELL_LEVEL_ID]: levelId }}
      onClick={handleClick}
      aria-label={`Delete level column with name: ${name}`}
    />
  );
});
