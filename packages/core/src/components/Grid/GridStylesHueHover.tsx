import { memo } from "react";

import { useSubscribe } from "@spred/react";

import { $hueIds } from "@core/stores/colors";
import { buildStyleString } from "@core/utils/style/buildStyleString";

import {
  DATA_ATTR_CELL_HUE_ID,
  DATA_ATTR_REMOVE_BUTTON,
  REMOVE_BUTTON_HOVER_STYLE,
} from "./constants";

/**
  This function generates CSS selectors and styles for the remove hue button when the hue row is hovered, focused, or has a focus-visible element.
  The row is determined by the DATA_ATTR_CELL_HUE_ID atribute and hueId.
  Such approach allows making the button visible without any JS logic.
  The selectors are generated for each hue row in the grid.
*/
export const GridStylesHueHover = memo(function GridStylesHueHover() {
  const hueIds = useSubscribe($hueIds);
  const selectors = hueIds.flatMap((hueId) => {
    const hueCellSelector = `[${DATA_ATTR_CELL_HUE_ID}="${hueId}"]`;

    return [
      `${hueCellSelector}:is(:hover,:focus-visible,:has(:focus-visible)) ~ ${hueCellSelector} [${DATA_ATTR_REMOVE_BUTTON}]`,
      `${hueCellSelector}:is(:hover,:has(:focus-visible)) [${DATA_ATTR_REMOVE_BUTTON}]`,
    ];
  });

  return <style>{buildStyleString(selectors, REMOVE_BUTTON_HOVER_STYLE)}</style>;
});
