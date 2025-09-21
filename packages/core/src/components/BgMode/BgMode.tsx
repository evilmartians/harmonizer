import type { ElementType } from "react";

import clsx from "clsx";

import type { PolymorphicComponentPropsWithRef } from "@core/utils/react/polymorphic";

import styles from "./BgMode.module.css";
import type { BgColorType, BgModeType } from "./types";

export type BgModeProps<E extends ElementType> = PolymorphicComponentPropsWithRef<E> & {
  className?: string;
  bgColorType: BgColorType | null;
  bgMode: BgModeType;
};

export function BgMode<E extends ElementType>({
  as,
  bgColorType,
  bgMode,
  ...restProps
}: BgModeProps<E>) {
  const Component: ElementType = as ?? "div";

  return (
    <Component
      {...restProps}
      className={clsx(styles.bgMode, bgColorType && styles[bgColorType], restProps.className)}
      data-bg-mode={bgMode}
    />
  );
}
