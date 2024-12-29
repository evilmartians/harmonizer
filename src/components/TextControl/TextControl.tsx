import classNames from "classnames";
import styles from "./TextControl.module.css";

export interface TextControlProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  inputSize?: "m" | "l";
  kind?: "bordered" | "ghost";
  align?: "left" | "center";
}

export function TextControl({
  className,
  label,
  inputSize = "m",
  kind = "bordered",
  align = "center",
  value,
  ...props
}: TextControlProps) {
  return (
    <div
      className={classNames(
        className,
        styles.container,
        styles[`size_${inputSize}`],
        styles[`kind_${kind}`]
      )}
    >
      {label && (
        <span
          className={classNames(
            styles.label,
            align === "center" && "text-center"
          )}
        >
          {label}
        </span>
      )}
      <input
        type="text"
        className={classNames(
          styles.input,
          align === "center" && "text-center",
          styles[`size_${inputSize}`]
        )}
        defaultValue={value}
        {...props}
      />
    </div>
  );
}
