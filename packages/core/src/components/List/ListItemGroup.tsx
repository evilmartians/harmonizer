import { Text } from "@core/components/Text/Text";
import { mergeProps } from "@core/utils/react/mergeProps";
import clsx from "clsx";
import type { ComponentProps } from "react";

import styles from "./List.module.css";

export type ListItemGroupProps = ComponentProps<"ul"> & {
  label: string;
  labelProps?: ComponentProps<"p">;
};

export function ListItemGroup({ label, labelProps, ...restProps }: ListItemGroupProps) {
  return (
    <li>
      <Text
        as="p"
        size="m"
        kind="secondary"
        {...mergeProps(labelProps, { className: clsx(styles.baseItem, styles.group) })}
      >
        {label}
      </Text>
      <ul {...restProps} />
    </li>
  );
}
