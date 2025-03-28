import type { BgModeType } from "@core/components/BgMode/types";
import { Button } from "@core/components/Button/Button";
import { MBin } from "@core/components/Icon/MBin";
import clsx from "clsx";
import { type HTMLAttributes, memo } from "react";

import { DATA_ATTR_REMOVE_BUTTON } from "./constants";
import { GridCell } from "./GridCell";
import styles from "./GridCellRemoveAxis.module.css";

export type GridCellRemoveAxisProps = HTMLAttributes<HTMLDivElement> & {
  bgMode: BgModeType;
  "aria-label": string;
  onClick: VoidFunction;
};

export const GridCellRemoveAxis = memo(function GridCellRemoveAxis({
  bgMode,
  "aria-label": ariaLabel,
  onClick,
  ...restProps
}: GridCellRemoveAxisProps) {
  return (
    <GridCell {...restProps} bgMode={bgMode} className={clsx(styles.cell, restProps.className)}>
      <Button
        className={styles.button}
        kind="ghost"
        size="m"
        rounded
        icon={<MBin />}
        onClick={onClick}
        aria-label={ariaLabel}
        {...{ [DATA_ATTR_REMOVE_BUTTON]: true }}
      />
    </GridCell>
  );
});
