import type { ElementType } from "react";

import clsx from "clsx";

import { Text } from "@core/components/Text/Text";
import type { PolymorphicComponentPropsWithRef } from "@core/utils/react/polymorphic";

import styles from "./List.module.css";

export type ListItemGroupLabelProps<E extends ElementType> = PolymorphicComponentPropsWithRef<E> & {
  className?: string;
};

export function ListItemGroupLabel<E extends ElementType>({
  as,
  className,
  ...restProps
}: ListItemGroupLabelProps<E>) {
  const Component: ElementType = as ?? "p";

  return (
    <Text
      as={Component}
      size="m"
      kind="secondary"
      className={clsx(styles.groupLabel, className)}
      {...restProps}
    />
  );
}
