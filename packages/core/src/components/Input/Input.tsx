import type { ComponentPropsWithRef, ReactNode, RefObject } from "react";

import clsx from "clsx";

import { useIdWithFallback } from "@core/hooks/useIdWithFallback";

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
  slotStart?: ReactNode;
  slotEnd?: ReactNode;
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
  slotStart,
  slotEnd,
  ...restProps
}: InputProps) {
  const id = useIdWithFallback(restProps.id);
  const labelId = `${id}-label`;

  return (
    <label
      className={clsx(className, styles.container, styles[`kind_${kind}`], styles[`size_${size}`])}
      style={{ ...style, ...customization }}
      title={title}
      ref={labelRef}
      htmlFor={id}
    >
      {label && (
        <span id={labelId} className={clsx(styles.label, size === "m" && "sr-only")}>
          {label}
        </span>
      )}
      <div className={styles.inputContainer}>
        {slotStart && <div className={clsx(styles.slot, styles.slotStart)}>{slotStart}</div>}
        <input
          {...(label ? { "aria-labelledby": labelId } : undefined)}
          {...restProps}
          value={value}
          className={styles.input}
          id={id}
        />
        {slotEnd && <div className={clsx(styles.slot, styles.slotEnd)}>{slotEnd}</div>}
      </div>
    </label>
  );
}
