import type { ElementType } from "react";

import clsx from "clsx";

import { BgMode } from "@core/components/BgMode/BgMode";
import type { PolymorphicComponentPropsWithRef } from "@core/utils/react/polymorphic";

import styles from "./List.module.css";
export type ListProps<E extends ElementType> = PolymorphicComponentPropsWithRef<E> & {
  className?: string;
};

export function List<E extends ElementType>({ as, className, ...restProps }: ListProps<E>) {
  const Component: ElementType = as ?? "ul";

  return (
    <BgMode as={Component} bgMode="dark" className={clsx(styles.list, className)} {...restProps} />
  );
}
