import { BgMode } from "@core/components/BgMode/BgMode";
import { Button } from "@core/components/Button/Button";
import { MArrowDownwards } from "@core/components/Icon/MArrowDownwards";
import { MSixDots } from "@core/components/Icon/MSixDots";
import { withAutosize } from "@core/components/Input/enhancers/withAutosize";
import { withValidation } from "@core/components/Input/enhancers/withValidation";
import { Input } from "@core/components/Input/Input";
import { Text } from "@core/components/Text/Text";
import { formatValidationError, safeParse } from "@core/schemas";
import { colorStringSchema } from "@core/schemas/color";
import { exportConfigSchema } from "@core/schemas/exportConfigSchema";
import { getConfig, updateConfig } from "@core/stores/config";
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
import type { ChangeEvent } from "react";

import { FileInputButton } from "../FileInputButton/FileInputButton";

import { GridCell } from "./GridCell";
import styles from "./GridRowBackground.module.css";

async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const result = safeParse(exportConfigSchema, JSON.parse(text));

    if (!result.success) {
      // eslint-disable-next-line no-alert
      alert(formatValidationError(result.issues));
      return;
    }

    updateConfig(result.output);
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(`Error reading config file: ${String(error)}`);
  } finally {
    // Reset input so the same file can be selected again
    e.target.value = "";
  }
}

function handleDownload() {
  const config = JSON.stringify(getConfig(), null, 2);
  const blob = new Blob([config], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "My Harmony config.json";
  document.body.append(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

const $bgColorLightAt0 = signal((get) => get($bgLightStart) === 0);

const BgColorInput = withValidation(withAutosize(Input));
const ExportImportButtons = () => {
  return (
    <div className={styles.importExportControls}>
      <FileInputButton
        kind="primary"
        size="s"
        onFilesChange={handleFileUpload}
        iconStart={<MArrowDownwards className={styles.iconUpload} />}
      >
        Upload
      </FileInputButton>
      <Button kind="primary" size="s" onClick={handleDownload} iconStart={<MArrowDownwards />}>
        Download
      </Button>
    </div>
  );
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
