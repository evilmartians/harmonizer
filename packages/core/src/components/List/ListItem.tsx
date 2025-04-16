import type { ComponentProps } from "react";

import clsx from "clsx";

import { Text } from "@core/components/Text/Text";
import { mergeProps } from "@core/utils/react/mergeProps";

import styles from "./List.module.css";

export type ListItemProps = ComponentProps<"li">;

export function ListItem({ value, children, ...restProps }: ListItemProps) {
  return (
    <Text
      as="li"
      size="m"
      kind="primary"
      {...mergeProps(restProps, { className: clsx(styles.baseItem, styles.item) })}
    >
      {children}
    </Text>
  );
}
