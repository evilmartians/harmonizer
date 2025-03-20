import { Button } from "@core/components/Button/Button";
import { MPlus } from "@core/components/Icon/MPlus";
import { withNumericIncrementControls } from "@core/components/Input/enhancers/withNumericIncrementControls";
import { withValidation } from "@core/components/Input/enhancers/withValidation";
import { Input } from "@core/components/Input/Input";
import { hueAngleSchema } from "@core/schemas/color";
import { getHue, insertHue, updateHueAngle, updateHueName } from "@core/stores/colors";
import { hueAngle, type HueId } from "@core/types";
import type { AnyProps } from "@core/utils/react/types";
import { getInputNumberValidator } from "@core/utils/schema/getInputValidator";
import { useSubscribe } from "@spred/react";
import { memo, useCallback } from "react";

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
  const name = useSubscribe(getHue(hueId).$name);
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

const NameInput = memo(function NameInput({ hueId }: HueComponentProps) {
  const hue = getHue(hueId);
  const name = useSubscribe(hue.$name);
  const tintColor = useSubscribe(hue.$tintColor);

  return (
    <Input
      className={styles.control}
      size="m"
      kind="ghost"
      customization={{ "--input-color": tintColor.css }}
      placeholder={PLACEHOLDER_NAME}
      value={name}
      title={HINT_NAME}
      onChange={(e) => updateHueName(hueId, e.target.value)}
    />
  );
});

const HueAngleInput = withValidation(withNumericIncrementControls(Input));
const hueAngleInputSchema = getInputNumberValidator(hueAngleSchema);
const AngleInput = memo(function AngleInput({ hueId }: HueComponentProps) {
  const angle = useSubscribe(getHue(hueId).$angle);

  return (
    <HueAngleInput
      className={styles.control}
      size="m"
      kind="ghost"
      placeholder={PLACEHOLDER_HUE}
      value={angle}
      title={HINT_DEGREE}
      schema={hueAngleInputSchema}
      onChange={(e) =>
        updateHueAngle(hueId, hueAngle(e.target.value ? Number.parseFloat(e.target.value) : 0))
      }
    />
  );
});

export const GridCellHueHeader = memo(function GridCellHueHeader({ hueId }: HueComponentProps) {
  return (
    <GridCell bgMode="dark" className={styles.cell} {...{ [DATA_ATTR_CELL_HUE_ID]: hueId }}>
      <InsertBeforeArea hueId={hueId} />
      <NameInput hueId={hueId} />
      <AngleInput hueId={hueId} />
    </GridCell>
  );
});
