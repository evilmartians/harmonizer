import { Button } from "@core/components/Button/Button";
import { MPlus } from "@core/components/Icon/MPlus";
import { withNumericIncrementControls } from "@core/components/Input/enhancers/withNumericIncrementControls";
import { withValidation } from "@core/components/Input/enhancers/withValidation";
import { Input } from "@core/components/Input/Input";
import { useAppEvent } from "@core/hooks/useFocusRefOnEvent";
import { getHue, insertHue, updateHueAngle, updateHueName } from "@core/stores/colors";
import { $bgColorDarkBgMode } from "@core/stores/settings";
import { HueAngle, HueName, type HueId } from "@core/types";
import type { AnyProps } from "@core/utils/react/types";
import { useSubscribe } from "@spred/react";
import { memo, useCallback, useRef } from "react";

import { DATA_ATTR_CELL_HUE_ID } from "./constants";
import { GridCell } from "./GridCell";
import styles from "./GridCellHueHeader.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type HueComponentProps<P extends AnyProps = {}> = { hueId: HueId } & P;

const PLACEHOLDER_NAME = "Name";
const PLACEHOLDER_HUE = "Hue";
const HINT_NAME = "Color name";
const HINT_DEGREE = "Hue 0…360";

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
  const error = useSubscribe(hue.name.$validationError);
  const tintColor = useSubscribe(hue.$tintColor);

  useAppEvent("hueAdded", (id) => {
    if (id === hueId) {
      inputRef.current?.focus();
    }
  });

  return (
    <HueNameInput
      ref={inputRef}
      className={styles.control}
      size="m"
      kind="ghost"
      customization={{ "--input-color": tintColor.css }}
      placeholder={PLACEHOLDER_NAME}
      value={name}
      title={HINT_NAME}
      error={error}
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
      size="m"
      kind="ghost"
      placeholder={PLACEHOLDER_HUE}
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
  const bgMode = useSubscribe($bgColorDarkBgMode);

  return (
    <GridCell bgMode={bgMode} className={styles.cell} {...{ [DATA_ATTR_CELL_HUE_ID]: hueId }}>
      <InsertBeforeArea hueId={hueId} />
      <NameInput hueId={hueId} />
      <AngleInput hueId={hueId} />
    </GridCell>
  );
});
