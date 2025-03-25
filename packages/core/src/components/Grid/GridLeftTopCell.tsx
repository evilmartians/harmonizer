import { Button } from "@core/components/Button/Button";
import { Select } from "@core/components/Select/Select";
import { Text } from "@core/components/Text/Text";
import {
  $chromaMode,
  $colorSpace,
  $contrastModel,
  $directionMode,
  toggleColorSpace,
  toggleContrastModel,
  toggleDirectionMode,
  updateChromaMode,
} from "@core/stores/settings";
import { ChromaMode } from "@core/types";
import { useSubscribe } from "@spred/react";
import clsx from "clsx";
import { memo } from "react";

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

export const GridLeftTopCell = memo(function GridLeftTopCell() {
  const contrastModel = useSubscribe($contrastModel);
  const directionMode = useSubscribe($directionMode);
  const chromaModeValue = useSubscribe($chromaMode);
  const colorSpace = useSubscribe($colorSpace);

  return (
    <GridCell bgMode="dark" className={styles.cell}>
      <Text size="s" kind="secondary" className={styles.levelLabel}>
        {LABEL_LEVEL}
      </Text>
      <div className={clsx(styles.container, styles.middle)}>
        <Button size="xs" onClick={toggleContrastModel}>
          {contrastModel}
        </Button>
        {contrastModel === "apca" && (
          <>
            <Text size="s" kind="secondary">
              {LABEL_CONTRACT}
            </Text>
            <Button size="xs" onClick={toggleDirectionMode}>
              {LABEL_DIRECTION_MODE[directionMode]}
            </Button>
          </>
        )}
      </div>

      <div className={clsx(styles.container, styles.bottom)}>
        <Select
          size="xs"
          value={chromaModeValue}
          options={CHROMA_OPTIONS}
          onChange={(e) => updateChromaMode(ChromaMode(e.target.value))}
          title={LABEL_CHROMA_MODE}
        />
        <div className={clsx(styles.container, styles.colorModePicker)}>
          <Button size="xs" onClick={toggleColorSpace}>
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
