import { useSubscribe } from "@spred/react";
import { memo } from "react";

import {
  DATA_ATTR_CELL_LEVEL_ID,
  DATA_ATTR_REMOVE_BUTTON,
  REMOVE_BUTTON_HOVER_STYLE,
} from "./constants";

import { $levelIds } from "@/stores/colors";
import { buildStyle } from "@/utils/styles";

export const GridStylesLevelHover = memo(function GridStylesLevelHover() {
  const levelIds = useSubscribe($levelIds);
  const selectors = levelIds.flatMap((levelId) => {
    const levelCellSelector = `[${DATA_ATTR_CELL_LEVEL_ID}="${levelId}"]`;

    return [
      `${levelCellSelector}:is(:hover,:focus-visible,:has(:focus-visible)) ~ ${levelCellSelector} [${DATA_ATTR_REMOVE_BUTTON}]`,
      `${levelCellSelector}:is(:hover,:has(:focus-visible)) [${DATA_ATTR_REMOVE_BUTTON}]`,
    ];
  });

  return <style>{buildStyle(selectors, REMOVE_BUTTON_HOVER_STYLE)}</style>;
});
