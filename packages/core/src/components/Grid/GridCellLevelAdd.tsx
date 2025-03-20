import { Button } from "@core/components/Button/Button";
import { LPlus } from "@core/components/Icon/LPlus";
import { insertLevel } from "@core/stores/colors";
import { memo, useCallback } from "react";

import { GridCell } from "./GridCell";
import styles from "./GridCellLevelAdd.module.css";

export const GridCellLevelAdd = memo(function GridCellLevelAdd() {
  const handleClick = useCallback(() => insertLevel(), []);

  return (
    <GridCell bgMode="light" className={styles.cell}>
      <Button
        className={styles.button}
        kind="ghost"
        size="l"
        icon={<LPlus />}
        onClick={handleClick}
        aria-label="Insert new level row at the end"
      />
    </GridCell>
  );
});
