import { Fragment, memo, useMemo, useRef, type PropsWithChildren } from "react";

import { useSubscribe } from "@spred/react";

import { useDragScrollByMiddleClick } from "@core/hooks/useDragScrollByMiddleClick";
import { $hueIds, $levelIds } from "@core/stores/colors";
import { $bgColorLightBgMode } from "@core/stores/settings";
import {
  $gridHasHorizontalScrollbar,
  $gridHasVerticalScrollbar,
  $gridHorizontallyScrolled,
  $gridVerticallyScrolled,
  setScrollableContainer,
} from "@core/stores/ui";
import { mergeRefs } from "@core/utils/react/mergeRefs";

import styles from "./Grid.module.css";
import { GridCell } from "./GridCell";
import { GridCellColor } from "./GridCellColor";
import { GridCellHueAdd } from "./GridCellHueAdd";
import { GridCellHueHeader } from "./GridCellHueHeader";
import { GridCellHueRemove } from "./GridCellHueRemove";
import { GridCellLevelAdd } from "./GridCellLevelAdd";
import { GridCellLevelHeader } from "./GridCellLevelHeader";
import { GridCellLevelRemove } from "./GridCellLevelRemove";
import { GridLeftTopCell } from "./GridLeftTopCell";
import { GridRowBackground } from "./GridRowBackground";
import { GridStylesBg } from "./GridStylesBg";
import { GridStylesHueHover } from "./GridStylesHueHover";
import { GridStylesLevelHover } from "./GridStylesLevelHover";

const GridContainer = memo(function GridContainer({ children }: PropsWithChildren) {
  const gridRef = useRef<HTMLDivElement>(null);
  const hasHorizontalScrollbar = useSubscribe($gridHasHorizontalScrollbar);
  const isHorizontallyScrolled = useSubscribe($gridHorizontallyScrolled);
  const hasVerticalScrollbar = useSubscribe($gridHasVerticalScrollbar);
  const isVerticallyScrolled = useSubscribe($gridVerticallyScrolled);

  const gridRefCallback = useMemo(() => mergeRefs(gridRef, setScrollableContainer), []);
  const attrs: Record<string, string> = {};

  if (hasHorizontalScrollbar) {
    attrs["data-with-horizontal-scrollbar"] = "";
  }

  if (isHorizontallyScrolled) {
    attrs["data-horizontally-scrolled"] = "";
  }

  if (hasVerticalScrollbar) {
    attrs["data-with-vertical-scrollbar"] = "";
  }

  if (isVerticallyScrolled) {
    attrs["data-vertically-scrolled"] = "";
  }

  useDragScrollByMiddleClick(gridRef);

  return (
    <div className={styles.grid} ref={gridRefCallback} {...attrs}>
      {children}
    </div>
  );
});

const GridCellLight = memo(function GridCellLight() {
  const bgMode = useSubscribe($bgColorLightBgMode);

  return <GridCell bgMode={bgMode} />;
});

export function Grid() {
  const levels = useSubscribe($levelIds);
  const hues = useSubscribe($hueIds);

  return (
    <>
      {/* Dynamic styles */}
      <GridStylesBg />
      <GridStylesLevelHover />
      <GridStylesHueHover />
      <GridContainer>
        {/* Header */}
        <GridLeftTopCell />
        {levels.map((levelId) => (
          <GridCellLevelHeader key={levelId} levelId={levelId} />
        ))}
        <GridCellLevelAdd />
        <GridCellLight />

        {/* Hues rows */}
        {hues.map((hueId) => (
          <Fragment key={hueId}>
            <GridCellHueHeader hueId={hueId} />
            {levels.map((levelId) => (
              <GridCellColor key={`${hueId}-${levelId}`} levelId={levelId} hueId={hueId} />
            ))}
            <GridCellHueRemove hueId={hueId} />
            <GridCellLight />
          </Fragment>
        ))}

        {/* Level controls */}
        <GridCellHueAdd />
        {levels.map((levelId) => (
          <GridCellLevelRemove key={levelId} levelId={levelId} />
        ))}
        <GridCellLight />
        <GridCellLight />

        {/* Background controls */}
        <GridRowBackground />
      </GridContainer>
    </>
  );
}
