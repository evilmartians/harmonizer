import { $levelIds } from "@core/stores/colors";
import { buildStyleString } from "@core/utils/style/buildStyleString";
import { useSubscribe } from "@spred/react";
import { memo } from "react";

import {
  DATA_ATTR_CELL_LEVEL_ID,
  DATA_ATTR_REMOVE_BUTTON,
  REMOVE_BUTTON_HOVER_STYLE,
} from "./constants";

export const GridStylesLevelHover = memo(function GridStylesLevelHover() {
  const levelIds = useSubscribe($levelIds);
  const selectors = levelIds.flatMap((levelId) => {
    const levelCellSelector = `[${DATA_ATTR_CELL_LEVEL_ID}="${levelId}"]`;

    return [
      `${levelCellSelector}:is(:hover,:focus-visible,:has(:focus-visible)) ~ ${levelCellSelector} [${DATA_ATTR_REMOVE_BUTTON}]`,
      `${levelCellSelector}:is(:hover,:has(:focus-visible)) [${DATA_ATTR_REMOVE_BUTTON}]`,
    ];
  });

  return <style>{buildStyleString(selectors, REMOVE_BUTTON_HOVER_STYLE)}</style>;
});
