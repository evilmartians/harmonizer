import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import styles from "./TextControl.module.css";

import type { ColorData } from "@/types";
import { ensureNonNullable } from "@/utils/ensureNonNullable";

const INPUT_MIN_SIZE = 40;

export type TextControlProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  label?: string;
  inputSize?: "m" | "l";
  kind?: "bordered" | "ghost";
  align?: "left" | "center";
  fitContent?: boolean;
  tintColor?: ColorData | null;
  validator?: (val: string) => string | null;
  onValidEdit: (val: string) => void;
};

export function TextControl({
  className,
  label,
  inputSize = "m",
  kind = "bordered",
  align = "center",
  fitContent = false,
  tintColor,
  validator,
  onValidEdit,
  value,
  title,
  ...props
}: TextControlProps) {
  const containerRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const borderColor = tintColor
    ? `oklch(${tintColor.l}% ${tintColor.c} ${tintColor.h} / 20%)`
    : undefined;

  // Auto shrink
  const [width, setWidth] = useState(INPUT_MIN_SIZE);
  useEffect(() => {
    if (inputRef.current) {
      const span = document.createElement("span");
      span.classList.add(ensureNonNullable(styles.input, "Input class not found"));
      span.textContent = inputRef.current.value || " ";
      document.body.append(span);
      setWidth(Math.max(span.offsetWidth, INPUT_MIN_SIZE));
      span.remove();
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = String(value);
    }
  }, [value]);

  // Validate input
  const handleChange = (val: string) => {
    const error = validator?.(val);
    if (error) {
      if (inputRef.current) {
        inputRef.current.classList.add("error");
        inputRef.current.title = error;
      }
    } else {
      if (inputRef.current) {
        inputRef.current.classList.remove("error");
        inputRef.current.title = title ?? "";
        inputRef.current.value = val;
      }
      onValidEdit(val);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      ref={containerRef}
      className={clsx(
        className,
        styles.container,
        styles[`size_${inputSize}`],
        styles[`kind_${kind}`],
      )}
      style={kind === "bordered" && borderColor ? { boxShadow: `0 0 0 1px ${borderColor}` } : {}}
      onClick={() => inputRef.current?.focus()}
      onKeyDown={() => inputRef.current?.focus()}
    >
      {label && (
        <span
          className={clsx(styles.label, align === "center" && "text-center")}
          style={tintColor ? { color: tintColor.css } : {}}
        >
          {label}
        </span>
      )}
      <input
        ref={inputRef}
        type="text"
        className={clsx(
          styles.input,
          align === "center" && "text-center",
          styles[`size_${inputSize}`],
        )}
        style={{
          ...(tintColor ? { color: tintColor.css } : {}),
          ...(fitContent ? { width: `${width}px` } : {}),
        }}
        defaultValue={value}
        onChange={(e) => handleChange(e.target.value)}
        title={title}
        {...props}
      />
    </div>
  );
}
