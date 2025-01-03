import { ReactNode } from "react";
import styles from "./TableCell.module.css";

export interface TableCellProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  onMouseEnter: () => void;
}

export function TableCell({
  className = "",
  style,
  children,
  onMouseEnter,
}: TableCellProps) {
  return (
    <div
      className={`${styles.container} ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </div>
  );
}
