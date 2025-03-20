import { $hueIds, $levelIds } from "@core/stores/colors";
import {
  $gridHorizontallyScrolled,
  $gridVerticallyScrolled,
  setScrollableContainer,
} from "@core/stores/ui";
import { useSubscribe } from "@spred/react";
import { Fragment, memo, type PropsWithChildren } from "react";

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
  const isHorizontallyScrolled = useSubscribe($gridHorizontallyScrolled);
  const isVerticallyScrolled = useSubscribe($gridVerticallyScrolled);
  const attrs: Record<string, string> = {};

  if (isHorizontallyScrolled) {
    attrs["data-horizontally-scrolled"] = "";
  }

  if (isVerticallyScrolled) {
    attrs["data-vertically-scrolled"] = "";
  }

  return (
    <div className={styles.grid} ref={setScrollableContainer} {...attrs}>
      {children}
    </div>
  );
});

const GridCellLight = memo(function GridCellLight() {
  return <GridCell bgMode="light" />;
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
        {levels.map((levelId, levelIndex) => (
          <GridCellLevelHeader key={levelId} levelId={levelId} levelIndex={levelIndex} />
        ))}
        <GridCellLevelAdd />
        <GridCellLight />

        {/* Hues rows */}
        {hues.map((hueId, hueIndex) => (
          <Fragment key={hueId}>
            <GridCellHueHeader hueId={hueId} />
            {levels.map((levelId, levelIndex) => (
              <GridCellColor
                key={`${hueId}-${levelId}`}
                levelId={levelId}
                levelIndex={levelIndex}
                hueId={hueId}
                hueIndex={hueIndex}
              />
            ))}
            <GridCellHueRemove hueId={hueId} />
            <GridCellLight />
          </Fragment>
        ))}

        {/* Level controls */}
        <GridCellHueAdd />
        {levels.map((levelId, levelIndex) => (
          <GridCellLevelRemove key={levelId} levelId={levelId} levelIndex={levelIndex} />
        ))}
        <GridCellLight />
        <GridCellLight />

        {/* Background controls */}
        <GridRowBackground />
      </GridContainer>
    </>
  );
}
