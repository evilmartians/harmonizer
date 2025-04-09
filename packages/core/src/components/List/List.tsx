import { BgMode } from "@core/components/BgMode/BgMode";
import { mergeProps } from "@core/utils/react/mergeProps";
import type { ComponentProps } from "react";

import styles from "./List.module.css";
export type ListProps = ComponentProps<"ul">;

export function List(props: ListProps) {
  return <BgMode as="ul" bgMode="dark" {...mergeProps(props, { className: styles.list })} />;
}
