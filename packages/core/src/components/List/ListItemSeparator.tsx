import type { ComponentProps } from "react";

import { mergeProps } from "@core/utils/react/mergeProps";

import styles from "./List.module.css";

export type ListItemSeparatorProps = ComponentProps<"li">;

export function ListItemSeparator(props: ListItemSeparatorProps) {
  return <li {...mergeProps(props, { className: styles.separator })} role="separator" />;
}
