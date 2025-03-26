import { BgMode } from "@core/components/BgMode/BgMode";
import { Button } from "@core/components/Button/Button";
import { MSixDots } from "@core/components/Icon/MSixDots";
import { withAutosize } from "@core/components/Input/enhancers/withAutosize";
import { withValidation } from "@core/components/Input/enhancers/withValidation";
import { Input } from "@core/components/Input/Input";
import { Text } from "@core/components/Text/Text";
import { useDependencies } from "@core/DependenciesContext";
import { colorStringSchema } from "@core/schemas/color";
import {
  $bgColorDark,
  $bgColorLight,
  $bgLightStart,
  updateBgColorDark,
  updateBgColorLight,
  updateBgLightStartByOffset,
} from "@core/stores/settings";
import { ColorString } from "@core/types";
import { handleSnappedHorizontalDrag } from "@core/utils/dnd/handleSnappedHorizontalDrag";
import { signal } from "@spred/core";
import { useSubscribe } from "@spred/react";
import clsx from "clsx";
import { memo, useEffect, useRef } from "react";

import { GridCell } from "./GridCell";
import styles from "./GridRowBackground.module.css";

const $bgColorLightAt0 = signal((get) => get($bgLightStart) === 0);

const BgColorInput = withValidation(withAutosize(Input));
const ExportImportButtons = () => {
  const { actions } = useDependencies();

  return <div className={styles.importExportControls}>{actions}</div>;
};
const SpacerCell = memo(function SpacerCell() {
  const lightStartAt0 = useSubscribe($bgColorLightAt0);

  if (lightStartAt0) {
    return null;
  }

  return (
    <GridCell bgMode="dark" className={styles.spacerCell}>
      <ExportImportButtons />
    </GridCell>
  );
});
const BgDarkSpan = memo(function BgDarkSpan() {
  const bgColorDark = useSubscribe($bgColorDark);
  const lightStartAt0 = useSubscribe($bgColorLightAt0);

  return (
    <BgMode
      bgMode="dark"
      className={clsx(
        styles.bgSpan,
        styles.dark,
        lightStartAt0 && styles.asRowHeader,
        lightStartAt0 && styles.asSpacer,
      )}
    >
      {lightStartAt0 && <ExportImportButtons />}
      <div className={styles.bgControlContainer}>
        <Text kind="secondary" size="s">
          Dark mode background
        </Text>
        <BgColorInput
          size="m"
          placeholder="#000"
          schema={colorStringSchema}
          value={bgColorDark}
          onChange={(e) => updateBgColorDark(ColorString(e.target.value))}
        />
      </div>
    </BgMode>
  );
});
const CELL_WIDTH = 104;
const DRAG_THRESHOLD = 0.75;
const BgLightSpan = memo(function BgLightSpan() {
  const dragButtonRef = useRef<HTMLButtonElement | null>(null);
  const bgColorLight = useSubscribe($bgColorLight);

  useEffect(() => {
    if (!dragButtonRef.current) return;

    return handleSnappedHorizontalDrag({
      element: dragButtonRef.current,
      snapWidth: CELL_WIDTH,
      threshold: DRAG_THRESHOLD,
      onChange: updateBgLightStartByOffset,
    });
  });

  return (
    <BgMode bgMode="light" className={clsx(styles.bgSpan, styles.light)}>
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
          size="m"
          placeholder="#fff"
          schema={colorStringSchema}
          value={bgColorLight}
          onChange={(e) => updateBgColorLight(ColorString(e.target.value))}
        />
      </div>
    </BgMode>
  );
});

export const GridRowBackground = memo(function GridRowBackground() {
  return (
    <>
      <SpacerCell />
      <BgDarkSpan />
      <BgLightSpan />
    </>
  );
});
