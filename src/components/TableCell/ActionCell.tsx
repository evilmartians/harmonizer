import classNames from "classnames";
import { TableCell } from "./TableCell";
import { AddRowButton } from "../Button/AddRowButton";
import { RemoveButton } from "../Button/RemoveButton";
import styles from "./ActionCell.module.css";
import { AddColumnButton } from "../Button/AddColumnButton";

interface ActionCellProps {
  className?: string;
  buttonClassName?: string;
  title: string;
  variant?: "column" | "row" | "remove";
  mode: "light" | "dark";
  onClick: () => void;
  onMouseEnter: () => void;
}

export function ActionCell({
  className,
  buttonClassName,
  title,
  variant = "column",
  mode,
  onClick,
  onMouseEnter,
}: ActionCellProps) {
  return (
    <TableCell className={className} onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        {variant === "row" ? (
          <AddRowButton mode={mode} title={title} onClick={onClick} />
        ) : variant === "remove" ? (
          <RemoveButton
            className={classNames(styles.button, buttonClassName)}
            mode={mode}
            title={title}
            onClick={onClick}
          />
        ) : (
          <AddColumnButton onClick={onClick} title={title} />
        )}
      </div>
    </TableCell>
  );
}
