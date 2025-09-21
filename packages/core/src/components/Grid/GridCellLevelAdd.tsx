import { memo, useCallback } from "react";

import { useSubscribe } from "@spred/react";

import { Button } from "@core/components/Button/Button";
import { LPlus } from "@core/components/Icon/LPlus";
import { $isAnyChromaCapSet, insertLevel, resetAllChroma } from "@core/stores/colors";
import { $bgColorModeRight } from "@core/stores/settings";

import { XsArrowBackCross } from "../Icon/XsArrowBackCross";

import { GridCell } from "./GridCell";
import styles from "./GridCellLevelAdd.module.css";

export const GridCellLevelAdd = memo(function GridCellLevelAdd() {
  const bgMode = useSubscribe($bgColorModeRight);
  const isAnyChromaCapSet = useSubscribe($isAnyChromaCapSet);
  const handleClick = useCallback(() => insertLevel(), []);

  return (
    <GridCell bgColorType="right" bgMode={bgMode} className={styles.cell}>
      <Button
        className={styles.addLevel}
        kind="bordered"
        size="l"
        icon={<LPlus />}
        onClick={handleClick}
        aria-label="Insert new level row at the end"
      />
      {isAnyChromaCapSet && (
        <Button
          className={styles.removeCaps}
          kind="primary"
          size="xs"
          iconStart={<XsArrowBackCross />}
          onClick={resetAllChroma}
        >
          All caps
        </Button>
      )}
    </GridCell>
  );
});
