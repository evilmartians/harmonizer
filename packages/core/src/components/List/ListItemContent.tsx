import type { ElementType } from "react";

import clsx from "clsx";

import { Text, type TextKind, type TextProps } from "@core/components/Text/Text";

import styles from "./List.module.css";

export type ListItemContentProps<E extends ElementType> = Omit<TextProps<E>, "size" | "kind"> & {
  className?: string;
  kind?: TextKind;
};

export function ListItemContent<E extends ElementType>({
  as,
  className,
  children,
  ...restProps
}: ListItemContentProps<E>) {
  const Component: ElementType = as ?? "div";

  return (
    <Text
      as={Component}
      className={clsx(styles.content, className)}
      size="m"
      kind="primary"
      {...restProps}
    >
      {children}
    </Text>
  );
}
