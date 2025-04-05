import { BgMode } from "@core/components/BgMode/BgMode";
import { Button } from "@core/components/Button/Button";
import { MSixDots } from "@core/components/Icon/MSixDots";
import { withAutosize } from "@core/components/Input/enhancers/withAutosize";
import { withValidation } from "@core/components/Input/enhancers/withValidation";
import { Input } from "@core/components/Input/Input";
import { Text } from "@core/components/Text/Text";
import { $levelsCount } from "@core/stores/colors";
import {
  $bgColorDarkBgMode,
  $bgColorLightBgMode,
  $bgColorSingleBgMode,
  $bgColorSingleStore,
  $bgLightStart,
  $isChangingBgBoundary,
  $isSingleDarkBg,
  $isSingleLightBg,
  bgColorDarkStore,
  bgColorLightStore,
  enableDualBg,
  startChangingBgBoundary,
  stopChangingBgBoundary,
  updateBgColorDark,
  updateBgColorLight,
  updateBgColorSingle,
  updateBgLightStartByOffset,
} from "@core/stores/settings";
import { ColorString } from "@core/types";
import { handleSnappedHorizontalDrag } from "@core/utils/dnd/handleSnappedHorizontalDrag";
import { useSubscribe } from "@spred/react";
import clsx from "clsx";
import { memo, useEffect, useRef } from "react";

import { LPlus } from "../Icon/LPlus";

import { GridCell } from "./GridCell";
import styles from "./GridRowBackground.module.css";

const HINT_SPLIT_BACKGROUND = "Split background into light and dark modes";

const BgColorInput = withValidation(withAutosize(Input));

const RowHeaderCell = memo(function SpacerCell() {
  const bgMode = useSubscribe($bgColorDarkBgMode);

  return (
    <GridCell bgMode={bgMode} className={styles.rowHeader}>
      <Text as="a" kind="secondary" size="s" href="https://evilmartians.com/" target="_blank">
        Harmonizer
        <br />
        by Evil Martians
      </Text>
    </GridCell>
  );
});
const BgDarkSpan = memo(function BgDarkSpan() {
  const bgColorDark = useSubscribe(bgColorDarkStore.$raw);
  const bgMode = useSubscribe($bgColorDarkBgMode);
  const error = useSubscribe(bgColorDarkStore.$validationError);

  return (
    <BgMode bgMode={bgMode} className={clsx(styles.bgSpan, styles.dark)}>
      <div className={styles.bgControlContainer}>
        <Text kind="secondary" size="s">
          Dark mode background
        </Text>
        <BgColorInput
          className={styles.bgColorInput}
          size="m"
          placeholder="#000"
          value={bgColorDark}
          error={error}
          onChange={(e) => updateBgColorDark(ColorString(e.target.value))}
        />
      </div>
    </BgMode>
  );
});

const BgSingleSpan = memo(function BgSingleSpan() {
  const bgColorSingleStore = useSubscribe($bgColorSingleStore);
  const bgColor = useSubscribe(bgColorSingleStore.$raw);
  const bgMode = useSubscribe($bgColorSingleBgMode);
  const error = useSubscribe(bgColorSingleStore.$validationError);

  return (
    <BgMode bgMode={bgMode} className={clsx(styles.bgSpan, styles.single)}>
      <div className={styles.bgControlContainer}>
        <Text kind="secondary" size="s">
          Background
        </Text>
        <BgColorInput
          className={styles.bgColorInput}
          size="m"
          placeholder="Color"
          value={bgColor}
          error={error}
          onChange={(e) => updateBgColorSingle(ColorString(e.target.value))}
        />
        {levelsCount > 1 && (
          <Button
            size="m"
            kind="bordered"
            onClick={enableDualBg}
            icon={<LPlus />}
            title={HINT_SPLIT_BACKGROUND}
            aria-label={HINT_SPLIT_BACKGROUND}
          />
        )}
      </div>
    </BgMode>
  );
});

const CELL_WIDTH = 104;
const DRAG_THRESHOLD = 0.75;
const BgLightSpan = memo(function BgLightSpan() {
  const dragButtonRef = useRef<HTMLButtonElement | null>(null);
  const bgColorLight = useSubscribe(bgColorLightStore.$raw);
  const bgMode = useSubscribe($bgColorLightBgMode);
  const error = useSubscribe(bgColorLightStore.$validationError);

  useEffect(() => {
    if (!dragButtonRef.current) return;

    return handleSnappedHorizontalDrag({
      element: dragButtonRef.current,
      snapWidth: CELL_WIDTH,
      threshold: DRAG_THRESHOLD,
      onChange: updateBgLightStartByOffset,
      onStart: startChangingBgBoundary,
      onEnd: stopChangingBgBoundary,
    });
  }, []);

  return (
    <BgMode bgMode={bgMode} className={clsx(styles.bgSpan, styles.light)}>
      <div className={styles.dragContainer}>
        <Button
          className={styles.dragButton}
          rounded
          size="m"
          kind="primary"
          icon={<MSixDots />}
          title="Drag to shift light mode start"
          ref={dragButtonRef}
        />
        <div className={styles.highlitingLine} />
      </div>
      <div className={styles.bgControlContainer}>
        <Text kind="secondary" size="s">
          Light mode background
        </Text>
        <BgColorInput
          className={styles.bgColorInput}
          size="m"
          placeholder="#fff"
          value={bgColorLight}
          error={error}
          onChange={(e) => updateBgColorLight(ColorString(e.target.value))}
        />
      </div>
    </BgMode>
  );
});

export function EndSpacerCell() {
  const bgMode = useSubscribe($bgColorLightBgMode);

  return <GridCell bgMode={bgMode} className={styles.endSpacerCell} />;
}

export const GridRowBackground = memo(function GridRowBackground() {
  const isSingleDarkBg = useSubscribe($isSingleDarkBg);
  const isSingleLightBg = useSubscribe($isSingleLightBg);
  const isSingleBg = isSingleDarkBg || isSingleLightBg;
  const bgLightStart = useSubscribe($bgLightStart);
  const isChangingBgBoundary = useSubscribe($isChangingBgBoundary);

  return (
    <>
      <RowHeaderCell />
      {(!isSingleBg || (isChangingBgBoundary && bgLightStart !== 0)) && <BgDarkSpan />}
      {isSingleBg && !isChangingBgBoundary && <BgSingleSpan />}
      {(!isSingleBg || isChangingBgBoundary) && <BgLightSpan />}
      {isSingleBg && <EndSpacerCell />}
    </>
  );
});
