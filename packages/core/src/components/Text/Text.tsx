import type { PolymorphicComponentPropsWithRef } from "@core/utils/react/polymorphic";
import clsx from "clsx";
import type { ElementType } from "react";

import styles from "./Text.module.css";

export type TextKind = "primary" | "secondary";
export type TextSize = "xs" | "s" | "m" | "l";
export type TextFont = "sans" | "mono";

export type TextProps<E extends ElementType> = PolymorphicComponentPropsWithRef<E> & {
  className?: string;
  kind?: TextKind;
  size: TextSize;
  font?: TextFont;
};

export function Text<C extends ElementType>({
  as,
  className,
  kind = "primary",
  size,
  font = "sans",
  ...restProps
}: TextProps<C>) {
  const Component = as ?? "span";

  return (
    <Component
      className={clsx(
        styles[`kind_${kind}`],
        styles[`size_${size}`],
        styles[`font_${font}`],
        className,
      )}
      {...restProps}
    />
  );
}
