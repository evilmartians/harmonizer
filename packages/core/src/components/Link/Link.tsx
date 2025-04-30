import { Text, type TextProps } from "@core/components/Text/Text";
import { mergeProps } from "@core/utils/react/mergeProps";

import styles from "./Link.module.css";

export type LinkProps = Omit<TextProps<"a">, "as">;

export function Link({ kind = "secondary", ...restProps }: LinkProps) {
  return <Text as="a" kind={kind} {...mergeProps(restProps, { className: styles.link })} />;
}
