import type { ElementType } from "react";

import clsx from "clsx";

import { BgMode, type BgModeProps } from "@core/components/BgMode/BgMode";
import type { BgModeType } from "@core/components/BgMode/types";

import styles from "./GridCell.module.css";

export type GridCellProps<E extends ElementType> = BgModeProps<E> & {
  bgStyle?: BgModeType;
};

export const GridCell = function GridCell<E extends ElementType>({
  className,
  bgStyle,
  ...restProps
}: GridCellProps<E>) {
  return (
    <BgMode
      {...(restProps as BgModeProps<E>)}
      className={clsx(styles.cell, styles[bgStyle ?? restProps.bgMode], className)}
    />
  );
};
