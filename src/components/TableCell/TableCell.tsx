import { ReactNode } from "react";
import styles from "./TableCell.module.css";

export interface TableCellProps {
  className?: string;
  children?: ReactNode;
  onMouseEnter: () => void;
}

export function TableCell({
  className = "",
  children,
  onMouseEnter,
}: TableCellProps) {
  return (
    <div
      className={`${styles.container} ${className}`}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </div>
  );
}
