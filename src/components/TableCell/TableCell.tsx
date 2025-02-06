import type { ReactNode } from "react";

import styles from "./TableCell.module.css";

export type TableCellProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  onMouseEnter: VoidFunction;
  onClick?: VoidFunction;
};

export function TableCell({
  className = "",
  style,
  children,
  onMouseEnter,
  onClick,
}: TableCellProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`${styles.container} ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.code === "enter") {
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
}
