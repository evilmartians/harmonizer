import classNames from "classnames";
import styles from "./TextControl.module.css";
import { Color } from "../../utils/colorUtils";
import { useEffect, useRef, useState } from "react";

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
}

export function TextControl({
  className,
  label,
  inputSize = "m",
  kind = "bordered",
  align = "center",
  fitContent = false,
  tint,
  value,
  ...props
}: TextControlProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const borderColor = tint
    ? `oklch(${tint.l}% ${tint.c} ${tint.h} / 20%)`
    : undefined;

  const [width, setWidth] = useState(INPUT_MIN_SIZE);
  useEffect(() => {
    if (inputRef.current) {
      const span = document.createElement("span");
      span.classList.add(styles.input);
      span.textContent = inputRef.current.value || " ";
      document.body.appendChild(span);
      setWidth(Math.max(span.offsetWidth, INPUT_MIN_SIZE));
      document.body.removeChild(span);
    }
  }, [value]);

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
        style={{
          ...(tint ? { color: tint.css } : {}),
          ...(fitContent ? { width: `${width}px` } : {}),
        }}
        defaultValue={value}
        {...props}
      />
    </div>
  );
}
