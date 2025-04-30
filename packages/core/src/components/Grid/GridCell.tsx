import type { ElementType } from "react";

import clsx from "clsx";

import { BgMode, type BgModeProps } from "@core/components/BgMode/BgMode";
import type { BgModeType } from "@core/components/BgMode/types";

import styles from "./GridCell.module.css";

export type GridCellProps<E extends ElementType> = BgModeProps<E> & {
  bgStyle?: BgModeType;
};

export const GridCell = function GridCell<E extends ElementType>(props: GridCellProps<E>) {
  return (
    <BgMode
      {...props}
      className={clsx(styles.cell, styles[props.bgStyle ?? props.bgMode], props.className)}
    />
  );
};
