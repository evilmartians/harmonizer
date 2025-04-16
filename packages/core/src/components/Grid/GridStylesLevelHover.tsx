import { memo } from "react";

import { useSubscribe } from "@spred/react";

import { $levelIds } from "@core/stores/colors";
import { buildStyleString } from "@core/utils/style/buildStyleString";

import {
  DATA_ATTR_CELL_LEVEL_ID,
  DATA_ATTR_REMOVE_BUTTON,
  REMOVE_BUTTON_HOVER_STYLE,
} from "./constants";

/**
  This function generates CSS selectors and styles for the remove level button when the level row is hovered, focused, or has a focus-visible element.
  The row is determined by the DATA_ATTR_CELL_LEVEL_ID atribute and levelId.
  Such approach allows making the button visible without any JS logic.
  The selectors are generated for each level column in the grid.
*/
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
