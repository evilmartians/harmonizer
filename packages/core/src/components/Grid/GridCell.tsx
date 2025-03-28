import { BgMode, type BgModeProps } from "@core/components/BgMode/BgMode";
import clsx from "clsx";
import type { ElementType } from "react";

import styles from "./GridCell.module.css";

export type GridCellProps<E extends ElementType> = BgModeProps<E> & {
  centered?: boolean;
};

export const GridCell = function GridCell<E extends ElementType>(props: GridCellProps<E>) {
  return <BgMode {...props} className={clsx(styles.cell, props.className)} />;
};
