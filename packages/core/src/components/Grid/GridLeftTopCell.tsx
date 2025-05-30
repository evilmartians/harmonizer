import { memo } from "react";

import { useSubscribe } from "@spred/react";
import clsx from "clsx";

import { Button } from "@core/components/Button/Button";
import { Select } from "@core/components/Select/Select";
import { Text } from "@core/components/Text/Text";
import { parseChromaMode } from "@core/schemas/settings";
import {
  chromaModeStore,
  colorSpaceStore,
  contrastModelStore,
  directionModeStore,
  $isColorSpaceLocked,
  toggleColorSpace,
  toggleContrastModel,
  toggleDirectionMode,
  updateChromaMode,
  $bgColorDarkBgMode,
} from "@core/stores/settings";

import { GridCell } from "./GridCell";
import styles from "./GridLeftTopCell.module.css";

const LABEL_LEVEL = "Color level";
const LABEL_CONTRACT = "contrast to";
const LABEL_DIRECTION_MODE = {
  bgToFg: "text",
  fgToBg: "background",
};
const LABEL_CHROMA_MODE = "Chroma mode";
const CHROMA_OPTIONS = [
  { value: "even", label: "Even chroma" },
  { value: "max", label: "Max chroma" },
];
const HINT_LOCKED_COLOR_SPACE = "To change color profile, adjust it in the Figma file settings";

export const GridLeftTopCell = memo(function GridLeftTopCell() {
  const bgMode = useSubscribe($bgColorDarkBgMode);
  const contrastModel = useSubscribe(contrastModelStore.$lastValidValue);
  const directionMode = useSubscribe(directionModeStore.$lastValidValue);
  const chromaModeValue = useSubscribe(chromaModeStore.$lastValidValue);
  const colorSpace = useSubscribe(colorSpaceStore.$lastValidValue);
  const isColorSpaceLocked = useSubscribe($isColorSpaceLocked);

  return (
    <GridCell bgMode={bgMode} className={styles.cell}>
      <Text size="s" kind="secondary" className={styles.levelLabel}>
        {LABEL_LEVEL}
      </Text>
      <div className={clsx(styles.container, styles.middle)}>
        <Button className={styles.contrastModelButton} size="xs" onClick={toggleContrastModel}>
          {contrastModel}
        </Button>
        {contrastModel === "apca" && (
          <>
            <Text size="s" kind="secondary">
              {LABEL_CONTRACT}
            </Text>
            <Button size="xs" onClick={toggleDirectionMode}>
              {LABEL_DIRECTION_MODE[directionMode as keyof typeof LABEL_DIRECTION_MODE]}
            </Button>
          </>
        )}
      </div>

      <div className={clsx(styles.container, styles.bottom)}>
        <Select
          size="xs"
          value={chromaModeValue}
          options={CHROMA_OPTIONS}
          onChange={(e) => updateChromaMode(parseChromaMode(e.target.value))}
          title={LABEL_CHROMA_MODE}
        />
        <div className={clsx(styles.container, styles.colorModePicker)}>
          <Button
            size="xs"
            onClick={toggleColorSpace}
            disabled={isColorSpaceLocked}
            title={isColorSpaceLocked ? HINT_LOCKED_COLOR_SPACE : undefined}
          >
            {colorSpace}
          </Button>
          <Text size="s" kind="secondary">
            colors
          </Text>
        </div>
      </div>
    </GridCell>
  );
});
