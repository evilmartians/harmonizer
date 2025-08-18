import { Fragment, memo, type ReactNode, useMemo, useRef, type PropsWithChildren } from "react";

import type { Signal } from "@spred/core";
import { useSignal, useSubscribe } from "@spred/react";
import clsx from "clsx";

import { useDragScrollByMiddleClick } from "@core/hooks/useDragScrollByMiddleClick";
import { $hueIds, $levelIds } from "@core/stores/colors";
import { $bgColorModeRight } from "@core/stores/settings";
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
import { GridStylesHueHover } from "./GridStylesHueHover";
import { GridStylesLevelHover } from "./GridStylesLevelHover";

const GridContainer = memo(function GridContainer({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
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
    <div className={clsx(styles.grid, className)} ref={gridRefCallback} {...attrs}>
      {children}
    </div>
  );
});

type GridCellLightProps = {
  className?: string;
};

const GridCellRight = memo(function GridCellLight({ className }: GridCellLightProps) {
  const bgMode = useSubscribe($bgColorModeRight);

  return <GridCell bgColor="right" bgMode={bgMode} className={className} />;
});

export type GridBanner = {
  $isClosed: Signal<boolean>;
  component: ReactNode;
};

type GridProps = {
  banner?: GridBanner;
};

export function Grid({ banner }: GridProps) {
  const levels = useSubscribe($levelIds);
  const hues = useSubscribe($hueIds);
  const $isBannerVisible = useSignal((get) => {
    if (!banner) {
      return false;
    }

    return !get(banner.$isClosed);
  });
  const isBannerVisible = useSubscribe($isBannerVisible);

  return (
    <>
      {/* Dynamic styles */}
      <GridStylesLevelHover />
      <GridStylesHueHover />
      <GridContainer className={clsx(isBannerVisible && styles.hasBanner)}>
        {isBannerVisible && banner?.component}
        {/* Header */}
        <GridLeftTopCell />
        {levels.map((levelId) => (
          <GridCellLevelHeader key={levelId} levelId={levelId} />
        ))}
        <GridCellLevelAdd />
        <GridCellRight className={styles.gridColumnHeader} />

        {/* Hues rows */}
        {hues.map((hueId) => (
          <Fragment key={hueId}>
            <GridCellHueHeader hueId={hueId} />
            {levels.map((levelId) => (
              <GridCellColor key={`${hueId}-${levelId}`} levelId={levelId} hueId={hueId} />
            ))}
            <GridCellHueRemove hueId={hueId} />
            <GridCellRight />
          </Fragment>
        ))}

        {/* Level controls */}
        <GridCellHueAdd />
        {levels.map((levelId) => (
          <GridCellLevelRemove key={levelId} levelId={levelId} />
        ))}
        <GridCellRight />
        <GridCellRight />

        {/* Background controls */}
        <GridRowBackground />
      </GridContainer>
    </>
  );
}
