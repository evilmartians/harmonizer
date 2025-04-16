import { memo, useCallback } from "react";

import { useSubscribe } from "@spred/react";

import { Button } from "@core/components/Button/Button";
import { LPlus } from "@core/components/Icon/LPlus";
import { insertLevel } from "@core/stores/colors";
import { $bgColorLightBgMode } from "@core/stores/settings";

import { GridCell } from "./GridCell";
import styles from "./GridCellLevelAdd.module.css";

export const GridCellLevelAdd = memo(function GridCellLevelAdd() {
  const bgMode = useSubscribe($bgColorLightBgMode);
  const handleClick = useCallback(() => insertLevel(), []);

  return (
    <GridCell bgMode={bgMode} className={styles.cell}>
      <Button
        className={styles.button}
        kind="bordered"
        size="l"
        icon={<LPlus />}
        onClick={handleClick}
        aria-label="Insert new level row at the end"
      />
    </GridCell>
  );
});
