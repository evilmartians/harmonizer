import { memo, useCallback, useRef } from "react";

import { useSubscribe } from "@spred/react";

import { Button } from "@core/components/Button/Button";
import { MArrowBack } from "@core/components/Icon/MArrowBack";
import { MPlus } from "@core/components/Icon/MPlus";
import { withNumericIncrementControls } from "@core/components/Input/enhancers/withNumericIncrementControls";
import { withValidation } from "@core/components/Input/enhancers/withValidation";
import { Input } from "@core/components/Input/Input";
import { useAppEvent } from "@core/hooks/useFocusRefOnEvent";
import { HUE_MAX_ANGLE, HUE_MIN_ANGLE } from "@core/schemas/color";
import {
  getHue,
  insertHue,
  resetHueName,
  updateHueAngle,
  updateHueName,
} from "@core/stores/colors";
import { $bgColorModeLeft } from "@core/stores/settings";
import { HueAngle, HueName, type HueId } from "@core/types";
import type { AnyProps } from "@core/utils/react/types";

import { DATA_ATTR_CELL_HUE_ID } from "./constants";
import { GridCell } from "./GridCell";
import styles from "./GridCellHueHeader.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type HueComponentProps<P extends AnyProps = {}> = { hueId: HueId } & P;

const LABEL_NAME = "Hue name";
const LABEL_HUE = "Hue angle";
const PLACEHOLDER_HUE = "Hue";
const HINT_NAME = "Color name";
const HINT_DEGREE = "Hue 0…360";
const HINT_RESTORE_COLOR_NAME = "Restore standard name";

const InsertBeforeArea = memo(function InsertBeforeArea({ hueId }: HueComponentProps) {
  const name = useSubscribe(getHue(hueId).name.$raw);
  const handleInsert = useCallback(() => insertHue(hueId), [hueId]);

  return (
    <div className={styles.insertBeforeContainer}>
      <Button
        className={styles.insertBeforeButton}
        kind="ghost"
        rounded
        size="m"
        icon={<MPlus />}
        onClick={handleInsert}
        aria-label={`Insert new hue row before row with name: ${name}`}
      />
    </div>
  );
});

const HueNameInput = withValidation(Input);
const NameInput = memo(function NameInput({ hueId }: HueComponentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hue = getHue(hueId);
  const name = useSubscribe(hue.name.$raw);
  const closestColorName = useSubscribe(hue.$closestColorName);
  const error = useSubscribe(hue.name.$validationError);
  const tintColor = useSubscribe(hue.$tintColor);
  const showResetNameButton = name !== closestColorName;

  useAppEvent("hueAdded", (id) => {
    if (id === hueId) {
      inputRef.current?.focus();
    }
  });

  return (
    <HueNameInput
      ref={inputRef}
      id={`hue-name-${hueId}`}
      className={styles.control}
      size="m"
      kind="ghost"
      customization={{ "--input-color": tintColor.css }}
      label={LABEL_NAME}
      placeholder={closestColorName}
      value={name}
      title={HINT_NAME}
      error={error}
      onBlur={() => {
        if (name === "") {
          resetHueName(hueId);
        }
      }}
      slotEnd={
        showResetNameButton && (
          <Button
            kind="ghost"
            size="m"
            className={styles.resetColorNameButton}
            icon={<MArrowBack />}
            title={HINT_RESTORE_COLOR_NAME}
            aria-label={HINT_RESTORE_COLOR_NAME}
            onClick={() => resetHueName(hueId)}
          />
        )
      }
      onChange={(e) => updateHueName(hueId, HueName(e.target.value))}
    />
  );
});

const HueAngleInput = withValidation(withNumericIncrementControls(Input));
const AngleInput = memo(function AngleInput({ hueId }: HueComponentProps) {
  const hue = getHue(hueId);
  const angle = useSubscribe(hue.angle.$raw);
  const error = useSubscribe(hue.angle.$validationError);

  return (
    <HueAngleInput
      className={styles.control}
      id={`hue-angle-${hueId}`}
      size="m"
      kind="ghost"
      label={LABEL_HUE}
      placeholder={PLACEHOLDER_HUE}
      min={HUE_MIN_ANGLE}
      max={HUE_MAX_ANGLE}
      value={angle}
      title={HINT_DEGREE}
      error={error}
      onChange={(e) =>
        updateHueAngle(hueId, HueAngle(e.target.value ? Number.parseFloat(e.target.value) : 0))
      }
    />
  );
});

export const GridCellHueHeader = memo(function GridCellHueHeader({ hueId }: HueComponentProps) {
  const bgMode = useSubscribe($bgColorModeLeft);

  return (
    <GridCell
      bgColor="left"
      bgMode={bgMode}
      className={styles.cell}
      {...{ [DATA_ATTR_CELL_HUE_ID]: hueId }}
    >
      <InsertBeforeArea hueId={hueId} />
      <NameInput hueId={hueId} />
      <AngleInput hueId={hueId} />
    </GridCell>
  );
});
