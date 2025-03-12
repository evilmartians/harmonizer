import clsx from "clsx";
import type { ComponentPropsWithRef, RefObject } from "react";

import styles from "./Input.module.css";

export type InputKind = "bordered" | "ghost";
export type InputSize = "m" | "xl";
export type InputProps = Omit<ComponentPropsWithRef<"input">, "size"> & {
  size: InputSize;
  label?: string;
  labelRef?: RefObject<HTMLLabelElement>;
  kind?: InputKind;
  fitContent?: boolean;
  customization?: {
    "--input-color"?: string;
    "--input-border-color"?: string;
    "--input-bg-color"?: string;
  };
};

export function Input({
  className,
  style,
  kind = "bordered",
  size = "m",
  label,
  labelRef,
  title,
  value,
  customization,
  ...restProps
}: InputProps) {
  return (
    <label
      className={clsx(className, styles.container, styles[`kind_${kind}`], styles[`size_${size}`])}
      style={{ ...style, ...customization }}
      title={title}
      ref={labelRef}
    >
      {label && <span className={clsx(styles.label, size === "m" && "sr-only")}>{label}</span>}
      <div className={styles.inputContainer}>
        <input className={styles.input} value={value} {...restProps} />
      </div>
    </label>
  );
}
