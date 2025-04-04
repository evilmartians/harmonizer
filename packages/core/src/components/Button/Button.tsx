import { extendableProp, type ExtendableProp } from "@core/utils/react/extendableProp";
import clsx from "clsx";
import type { ComponentPropsWithRef } from "react";

import styles from "./Button.module.css";

export type ButtonSize = "xs" | "s" | "m" | "l";
export type ButtonKind = "primary" | "ghost" | "floating";
export type ButtonProps = ComponentPropsWithRef<"button"> & {
  size: ButtonSize;
  kind?: ButtonKind;
  rounded?: boolean;
  iconStart?: ExtendableProp<{ className?: string }>;
  icon?: ExtendableProp<{ className?: string }>;
  iconEnd?: ExtendableProp<{ className?: string }>;
};

export function Button({
  className,
  type = "button",
  kind = "primary",
  size,
  iconStart,
  icon,
  iconEnd,
  rounded,
  children,
  ...restProps
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        styles[`kind_${kind}`],
        styles[`size_${size}`],
        rounded && styles.rounded,
        className,
      )}
      {...restProps}
    >
      {extendableProp(iconStart, { className: styles.icon })}
      {icon ? extendableProp(icon, { className: styles.icon }) : children}
      {extendableProp(iconEnd, { className: styles.icon })}
    </button>
  );
}
