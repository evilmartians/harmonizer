import { getHue, removeHue } from "@core/stores/colors";
import type { HueId } from "@core/types";
import { useSubscribe } from "@spred/react";
import { memo, useCallback } from "react";

import { DATA_ATTR_CELL_HUE_ID } from "./constants";
import { GridCellRemoveAxis } from "./GridCellRemoveAxis";

export type GridCellHueRemoveProps = {
  hueId: HueId;
};

export const GridCellHueRemove = memo(function GridCellHueRemove({
  hueId,
}: GridCellHueRemoveProps) {
  const hue = getHue(hueId);
  const name = useSubscribe(hue.$name);
  const handleClick = useCallback(() => removeHue(hueId), [hueId]);

  return (
    <GridCellRemoveAxis
      bgMode="light"
      {...{ [DATA_ATTR_CELL_HUE_ID]: hueId }}
      onClick={handleClick}
      aria-label={`Delete hue row with name: ${name}`}
    />
  );
});
