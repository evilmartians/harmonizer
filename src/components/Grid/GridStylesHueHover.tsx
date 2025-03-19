import { useSubscribe } from "@spred/react";
import { memo } from "react";

import {
  DATA_ATTR_CELL_HUE_ID,
  DATA_ATTR_REMOVE_BUTTON,
  REMOVE_BUTTON_HOVER_STYLE,
} from "./constants";

import { $hueIds } from "@/stores/colors";
import { buildStyleString } from "@/utils/style/buildStyleString";

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
