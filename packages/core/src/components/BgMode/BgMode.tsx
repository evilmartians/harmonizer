import type { ElementType } from "react";

import clsx from "clsx";

import type { PolymorphicComponentPropsWithRef } from "@core/utils/react/polymorphic";

import styles from "./BgMode.module.css";
import type { BgColor, BgModeType } from "./types";

export type BgModeProps<E extends ElementType> = PolymorphicComponentPropsWithRef<E> & {
  className?: string;
  bgColor: BgColor | null;
  bgMode: BgModeType;
};

export function BgMode<E extends ElementType>({
  as,
  bgColor,
  bgMode,
  ...restProps
}: BgModeProps<E>) {
  const Component: ElementType = as ?? "div";

  return (
    <Component
      {...restProps}
      className={clsx(styles.bgMode, bgColor && styles[bgColor], restProps.className)}
      data-bg-mode={bgMode}
    />
  );
}
