import type { ElementType } from "react";

import clsx from "clsx";

import type { PolymorphicComponentPropsWithRef } from "@core/utils/react/polymorphic";

import styles from "./List.module.css";

export type ListItemProps<E extends ElementType> = PolymorphicComponentPropsWithRef<E> & {
  className?: string;
  highlighted?: boolean;
};

export function ListItem<E extends ElementType>({
  as,
  className,
  highlighted,
  ...restProps
}: ListItemProps<E>) {
  const Component: ElementType = as ?? "li";

  return (
    <Component
      className={clsx(styles.item, className, highlighted && styles.highlighted)}
      {...restProps}
    />
  );
}
