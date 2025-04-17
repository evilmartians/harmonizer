import { Text, type TextProps } from "@core/components/Text/Text";
import { mergeProps } from "@core/utils/react/mergeProps";

import styles from "./Link.module.css";

export type LinkProps = Omit<TextProps<"a">, "as" | "kind">;

export function Link(props: LinkProps) {
  return <Text as="a" kind="secondary" {...mergeProps(props, { className: styles.link })} />;
}
