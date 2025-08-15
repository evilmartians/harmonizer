import { memo, useEffect, useRef } from "react";

import { useSubscribe } from "@spred/react";
import clsx from "clsx";
import { upperFirst } from "es-toolkit";

import { Button } from "@core/components/Button/Button";
import { LPlus } from "@core/components/Icon/LPlus";
import { LYoutube } from "@core/components/Icon/LYoutube";
import { MSixDots } from "@core/components/Icon/MSixDots";
import { withAutosize } from "@core/components/Input/enhancers/withAutosize";
import { withValidation } from "@core/components/Input/enhancers/withValidation";
import { Input } from "@core/components/Input/Input";
import { Link } from "@core/components/Link/Link";
import { Text } from "@core/components/Text/Text";
import { EVIL_MARTIANS_URL, YOUTUBE_TUTORIAL_URL } from "@core/constants";
import { $levelsCount } from "@core/stores/colors";
import {
  $bgColorDarkBgMode,
  $bgColorLightBgMode,
  $bgColorSingleBgMode,
  $bgColorSingleStore,
  $bgLightStart,
  $isSingleDarkBg,
  $isSingleLightBg,
  bgColorDarkStore,
  bgColorLightStore,
  directionModeStore,
  enableDualBg,
  updateBgColorDark,
  updateBgColorLight,
  updateBgColorSingle,
  updateBgLightStartByOffset,
} from "@core/stores/settings";
import {
  $isChangingBgBoundary,
  startChangingBgBoundary,
  stopChangingBgBoundary,
} from "@core/stores/ui";
import { ColorString } from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";
import { handleSnappedHorizontalDrag } from "@core/utils/dnd/handleSnappedHorizontalDrag";
import { getResolvedCssCustomProperty } from "@core/utils/dom/getResolvedCssCustomProperty";

import { GridCell } from "./GridCell";
import styles from "./GridRowBackground.module.css";

const HINT_SPLIT_BACKGROUND = "Split background into light and dark modes";

type BgLabelParts = readonly [bgTypePrefix: string | null, directionAppendix: string];
function useBgLabel(bgType: "dark" | "light" | "single"): { text: string; parts: BgLabelParts } {
  const directionMode = useSubscribe(directionModeStore.$lastValidValue);
  const directionAppendix = directionMode === "fgToBg" ? "background" : "text";

  if (bgType === "single") {
    const directionAppendixUpper = upperFirst(directionAppendix);

    return { text: directionAppendixUpper, parts: [null, directionAppendixUpper] };
  }

  const bgModeLabel = bgType === "dark" ? "Dark mode" : "Light mode";
  const parts = [bgModeLabel, directionAppendix] as const;

  return { text: parts.join(" "), parts };
}

type BgLabelProps = { bgLabelParts: BgLabelParts; isSingleBg?: boolean };
const BgLabel = memo(function BgLabel({ bgLabelParts, isSingleBg }: BgLabelProps) {
  return (
    <Text kind="secondary" size="s" className={styles.hideWhenSingleColumn} aria-hidden>
      {bgLabelParts[0]}{" "}
      <span className={clsx(styles.hideWhenTwoColumns, isSingleBg && styles.singleModeLabel)}>
        {bgLabelParts[1]}
      </span>
    </Text>
  );
});

const BgColorInput = withValidation(withAutosize(Input));

const RowHeaderCell = memo(function SpacerCell() {
  const bgMode = useSubscribe($bgColorDarkBgMode);

  return (
    <GridCell bgMode={bgMode} className={styles.rowHeader}>
      <Link size="s" href={EVIL_MARTIANS_URL} target="_blank">
        Harmonizer
        <br />
        by Evil Martians
      </Link>
    </GridCell>
  );
});

const YoutubeLink = memo(function YoutubeLink() {
  return (
    <Link size="s" className={styles.youtubeLink} href={YOUTUBE_TUTORIAL_URL} target="_blank">
      <LYoutube className={styles.youtubeIcon} />
      Watch <br /> tutorial
    </Link>
  );
});

const BgDarkSpan = memo(function BgDarkSpan() {
  const bgColorDark = useSubscribe(bgColorDarkStore.$raw);
  const bgMode = useSubscribe($bgColorDarkBgMode);
  const bgLightStart = useSubscribe($bgLightStart);
  const error = useSubscribe(bgColorDarkStore.$validationError);
  const { text: label, parts: bgLabelParts } = useBgLabel("dark");

  return (
    <GridCell bgMode={bgMode} className={clsx(styles.bgSpan, styles.dark)}>
      {bgLightStart > 1 && <YoutubeLink />}
      <div className={styles.bgControlContainer}>
        <BgLabel bgLabelParts={bgLabelParts} />
        <BgColorInput
          className={styles.bgColorInput}
          size="m"
          label={label}
          placeholder="#000"
          value={bgColorDark}
          error={error}
          onChange={(e) => updateBgColorDark(ColorString(e.target.value))}
        />
      </div>
    </GridCell>
  );
});

const BgSingleSpan = memo(function BgSingleSpan() {
  const bgColorSingleStore = useSubscribe($bgColorSingleStore);
  const levelsCount = useSubscribe($levelsCount);
  const bgColor = useSubscribe(bgColorSingleStore.$raw);
  const bgMode = useSubscribe($bgColorSingleBgMode);
  const error = useSubscribe(bgColorSingleStore.$validationError);
  const { text: label, parts: bgLabelParts } = useBgLabel("single");

  return (
    <GridCell bgMode={bgMode} className={clsx(styles.bgSpan, styles.single)}>
      {levelsCount > 2 && <YoutubeLink />}
      <div className={styles.bgControlContainer}>
        <BgLabel bgLabelParts={bgLabelParts} isSingleBg />
        <BgColorInput
          className={styles.bgColorInput}
          size="m"
          label={label}
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
    </GridCell>
  );
});

const DRAG_THRESHOLD = 0.75;
const BgLightSpan = memo(function BgLightSpan() {
  const dragButtonRef = useRef<HTMLButtonElement | null>(null);
  const bgColorLight = useSubscribe(bgColorLightStore.$raw);
  const bgMode = useSubscribe($bgColorLightBgMode);
  const error = useSubscribe(bgColorLightStore.$validationError);
  const { text: label, parts: bgLabelParts } = useBgLabel("light");

  useEffect(() => {
    if (!dragButtonRef.current) return;

    const snapWidth = Number.parseInt(
      getResolvedCssCustomProperty(dragButtonRef.current, "--grid-column-inline-size", "width"),
    );

    invariant(!Number.isNaN(snapWidth), "Invalid snap width");

    return handleSnappedHorizontalDrag({
      element: dragButtonRef.current,
      snapWidth,
      threshold: DRAG_THRESHOLD,
      onChange: updateBgLightStartByOffset,
      onStart: startChangingBgBoundary,
      onEnd: stopChangingBgBoundary,
    });
  }, []);

  return (
    <GridCell bgMode={bgMode} className={clsx(styles.bgSpan, styles.light)}>
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
        <BgLabel bgLabelParts={bgLabelParts} />
        <BgColorInput
          className={styles.bgColorInput}
          size="m"
          label={label}
          placeholder="#fff"
          value={bgColorLight}
          error={error}
          onChange={(e) => updateBgColorLight(ColorString(e.target.value))}
        />
      </div>
    </GridCell>
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
