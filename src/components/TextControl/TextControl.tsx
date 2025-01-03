import classNames from "classnames";
import styles from "./TextControl.module.css";
import { Color } from "../../utils/colorUtils";
import { useRef } from "react";

export interface TextControlProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  inputSize?: "m" | "l";
  kind?: "bordered" | "ghost";
  align?: "left" | "center";
  tint?: Color;
}

export function TextControl({
  className,
  label,
  inputSize = "m",
  kind = "bordered",
  align = "center",
  tint,
  value,
  ...props
}: TextControlProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const borderColor = tint
    ? `oklch(${tint.l}% ${tint.c} ${tint.h} / 20%)`
    : undefined;
  return (
    <div
      className={classNames(
        className,
        styles.container,
        styles[`size_${inputSize}`],
        styles[`kind_${kind}`]
      )}
      style={
        kind === "bordered" && borderColor
          ? { boxShadow: `0 0 0 1px ${borderColor}` }
          : {}
      }
      onClick={() => inputRef.current?.focus()}
    >
      {label && (
        <span
          className={classNames(
            styles.label,
            align === "center" && "text-center"
          )}
          style={tint ? { color: tint?.css } : {}}
        >
          {label}
        </span>
      )}
      <input
        ref={inputRef}
        type="text"
        className={classNames(
          styles.input,
          align === "center" && "text-center",
          styles[`size_${inputSize}`]
        )}
        style={tint ? { color: tint?.css } : {}}
        defaultValue={value}
        {...props}
      />
    </div>
  );
}
