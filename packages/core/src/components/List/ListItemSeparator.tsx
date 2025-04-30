import type { ElementType } from "react";

import clsx from "clsx";

import type { PolymorphicComponentPropsWithRef } from "@core/utils/react/polymorphic";

import styles from "./List.module.css";

export type ListItemSeparatorProps<E extends ElementType> = PolymorphicComponentPropsWithRef<E> & {
  className?: string;
};

export function ListItemSeparator<E extends ElementType>({
  as,
  className,
  ...restProps
}: ListItemSeparatorProps<E>) {
  const Component: ElementType = as ?? "li";

  return (
    <Component className={clsx(styles.separator, className)} role="separator" {...restProps} />
  );
}
