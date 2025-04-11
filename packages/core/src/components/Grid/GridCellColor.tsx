import { Text } from "@core/components/Text/Text";
import { $huesCount, $levelsCount, getColor$ } from "@core/stores/colors";
import type { ColorCellData, HueId, HueIndex, LevelId, LevelIndex } from "@core/types";
import { isLightColor } from "@core/utils/colors/isLightColor";
import { useValueAsSignal } from "@core/utils/spred/useValueAsSignal";
import { useSignal, useSubscribe } from "@spred/react";
import clsx from "clsx";
import { shallowEqual } from "fast-equals";
import { memo } from "react";

import { DATA_ATTR_CELL_HUE_ID, DATA_ATTR_CELL_LEVEL_ID } from "./constants";
import { GridCell } from "./GridCell";
import styles from "./GridCellColor.module.css";

function buildOklchUrl(color: ColorCellData) {
  return `https://oklch.com/#${color.l * 100},${color.c},${color.h},100`;
}

function useColorCellModifiers(levelIndex: LevelIndex, hueIndex: HueIndex) {
  const $levelIndex = useValueAsSignal(levelIndex);
  const $hueIndex = useValueAsSignal(hueIndex);
  const $modifiers = useSignal(
    (get) => {
      const levelsCount = get($levelsCount);
      const levelIndex = get($levelIndex);
      const huesCount = get($huesCount);
      const hueIndex = get($hueIndex);
      const isFirstLevel = levelIndex === 0;
      const isFirstHue = hueIndex === 0;
      const isLastLevel = levelIndex === levelsCount - 1;
      const isLastHue = hueIndex === huesCount - 1;

      const isTl = isFirstLevel && isFirstHue;
      const isTr = isLastLevel && isFirstHue;
      const isBl = isFirstLevel && isLastHue;
      const isBr = isLastLevel && isLastHue;

      return { isTl, isTr, isBl, isBr };
    },
    { equal: shallowEqual },
  );

  return useSubscribe($modifiers);
}

export type GridCellColorProps = {
  className?: string;
  levelId: LevelId;
  levelIndex: LevelIndex;
  hueId: HueId;
  hueIndex: HueIndex;
};

export const GridCellColor = memo(function GridCellColor({
  className,
  levelId,
  levelIndex,
  hueId,
  hueIndex,
}: GridCellColorProps) {
  const color = useSubscribe(getColor$(levelId, hueId));
  const { isTl, isTr, isBl, isBr } = useColorCellModifiers(levelIndex, hueIndex);
  const bgMode = isLightColor(color.l) ? "dark" : "light";

  return (
    <GridCell
      as="a"
      target="_blank"
      href={buildOklchUrl(color)}
      className={clsx(styles.cell, className)}
      bgMode={bgMode === "light" ? "dark" : "light"}
      {...{ [DATA_ATTR_CELL_HUE_ID]: hueId, [DATA_ATTR_CELL_LEVEL_ID]: levelId }}
    >
      <div
        className={clsx(styles.colorContainer, {
          [String(styles.tl)]: isTl,
          [String(styles.tr)]: isTr,
          [String(styles.bl)]: isBl,
          [String(styles.br)]: isBr,
        })}
        style={{ backgroundColor: color.css }}
      >
        <div className={styles.line}>
          <Text as="span" size="s" kind="secondary" font="mono" className={styles.lightness}>
            L{(color.l * 100).toFixed(2)}%
          </Text>
          {color.p3 && (
            <Text as="span" size="xs" font="mono" className={styles.p3Label}>
              P3
            </Text>
          )}
        </div>
        <Text as="span" size="l" kind="primary" font="mono" className={styles.contrast}>
          {color.cr}
        </Text>
        <div className={styles.line}>
          <Text as="span" size="s" kind="secondary" font="mono" className={styles.chroma}>
            C{color.c.toFixed(2)}
          </Text>
          <Text as="span" size="s" kind="secondary" font="mono" className={styles.hue}>
            H{color.h}
          </Text>
        </div>
      </div>
    </GridCell>
  );
});
