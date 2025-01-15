import { ensureNonNullable } from "@/utils/ensureNonNullable";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import type { Color } from "../../utils/color";
import styles from "./TextControl.module.css";

const INPUT_MIN_SIZE = 40;

export interface TextControlProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  inputSize?: "m" | "l";
  kind?: "bordered" | "ghost";
  align?: "left" | "center";
  fitContent?: boolean;
  tint?: Color;
  validator?: (val: string) => string | null;
  onValidEdit: (val: string) => void;
}

export function TextControl({
  className,
  label,
  inputSize = "m",
  kind = "bordered",
  align = "center",
  fitContent = false,
  tint,
  validator,
  onValidEdit,
  value,
  title,
  ...props
}: TextControlProps) {
  const containerRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const borderColor = tint
    ? `oklch(${tint.l}% ${tint.c} ${tint.h} / 20%)`
    : undefined;

  // Auto shrink
  const [width, setWidth] = useState(INPUT_MIN_SIZE);
  useEffect(() => {
    if (inputRef.current) {
      const span = document.createElement("span");
      span.classList.add(
        ensureNonNullable(styles.input, "Input class not found"),
      );
      span.textContent = inputRef.current.value || " ";
      document.body.appendChild(span);
      setWidth(Math.max(span.offsetWidth, INPUT_MIN_SIZE));
      document.body.removeChild(span);
    }
  }, []);

  // Validate input
  const handleChange = (val: string) => {
    const error = validator?.(val);
    if (!error) {
      if (inputRef.current) {
        inputRef.current.classList.remove("error");
        inputRef.current.title = title ?? "";
      }
      onValidEdit(val);
    } else {
      if (inputRef.current) {
        inputRef.current.classList.add("error");
        inputRef.current.title = error;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={classNames(
        className,
        styles.container,
        styles[`size_${inputSize}`],
        styles[`kind_${kind}`],
      )}
      style={
        kind === "bordered" && borderColor
          ? { boxShadow: `0 0 0 1px ${borderColor}` }
          : {}
      }
      onClick={() => inputRef.current?.focus()}
      onKeyDown={() => inputRef.current?.focus()}
    >
      {label && (
        <span
          className={classNames(
            styles.label,
            align === "center" && "text-center",
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
          styles[`size_${inputSize}`],
        )}
        style={{
          ...(tint ? { color: tint.css } : {}),
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
