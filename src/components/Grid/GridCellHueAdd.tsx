import { memo, useCallback } from "react";

import { GridCell } from "./GridCell";
import styles from "./GridCellHueAdd.module.css";

import { Button } from "@/components/Button/Button";
import { LPlus } from "@/components/Icon/LPlus";
import { insertHue } from "@/stores/colors";

export const GridCellHueAdd = memo(function GridCellHueAdd() {
  const handleClick = useCallback(() => insertHue(), []);

  return (
    <GridCell bgMode="dark" className={styles.cell}>
      <Button
        className={styles.button}
        kind="ghost"
        size="l"
        rounded
        icon={<LPlus />}
        onClick={handleClick}
        aria-label="Insert new hue row at the end"
      />
    </GridCell>
  );
});
