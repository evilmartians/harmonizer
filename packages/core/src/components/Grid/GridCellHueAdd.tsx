import { memo, useCallback } from "react";

import { useSubscribe } from "@spred/react";

import { Button } from "@core/components/Button/Button";
import { LPlus } from "@core/components/Icon/LPlus";
import { insertHue } from "@core/stores/colors";
import { $bgColorDarkBgMode } from "@core/stores/settings";

import { GridCell } from "./GridCell";
import styles from "./GridCellHueAdd.module.css";

export const GridCellHueAdd = memo(function GridCellHueAdd() {
  const bgMode = useSubscribe($bgColorDarkBgMode);
  const handleClick = useCallback(() => insertHue(), []);

  return (
    <GridCell bgMode={bgMode} className={styles.cell}>
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
