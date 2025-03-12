import clsx from "clsx";

import { Button, type ButtonProps } from "./Button";
import styles from "./ToggleButton.module.css";

export type ToggleButtonProps = ButtonProps & {
  checked: boolean;
};

export function ToggleButton({ checked, children, ...restProps }: ToggleButtonProps) {
  return (
    <Button
      {...restProps}
      className={clsx(restProps.className, checked && styles.checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className="sr-only" aria-hidden="true">
        {checked ? "off" : "on"}
      </span>
      {children}
    </Button>
  );
}
