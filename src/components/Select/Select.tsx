import clsx from "clsx";
import { useRef, type ComponentPropsWithRef } from "react";

import styles from "./Select.module.css";

import { Button, type ButtonKind, type ButtonSize } from "@/components/Button/Button";
import { MTriangleDown } from "@/components/Icon/MTriangleDown";

export type SelectProps = Omit<ComponentPropsWithRef<"select">, "size"> & {
  size: ButtonSize;
  kind?: ButtonKind;
  value: string;
  placeholder?: string;
  options: { value: string; label: string }[];
};

export function Select({
  className,
  kind = "primary",
  size,
  value,
  options,
  placeholder = "Select an option",
  ...restProps
}: SelectProps) {
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={clsx(styles.container, className)}>
      <select ref={selectRef} className={styles.nativeSelect} value={value} {...restProps}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <Button tabIndex={-1} size={size} kind={kind} className={styles.button}>
        {selected?.label ?? placeholder}
        <MTriangleDown className={clsx(styles.icon, styles[`size_${size}`])} />
      </Button>
    </div>
  );
}
