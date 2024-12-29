import classNames from "classnames";
import { TableCell } from "./TableCell";
import { AddColumnButton } from "../Button/AddColumnButton";
import { AddRowButton } from "../Button/AddRowButton";
import { RemoveButton } from "../Button/RemoveButton";
import styles from "./ActionCell.module.css";

interface ActionCellProps {
  className?: string;
  buttonClassName?: string;
  title: string;
  variant?: "column" | "row" | "remove";
  //isVisible?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

export function ActionCell({
  className,
  buttonClassName,
  title,
  variant = "column",
  //isVisible = true,
  onClick,
  onMouseEnter,
}: ActionCellProps) {
  return (
    <TableCell className={className} onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        {variant === "row" ? (
          <AddRowButton title={title} onClick={onClick} />
        ) : variant === "remove" ? (
          <RemoveButton
            className={classNames(
              styles.button,
              buttonClassName /*isVisible && styles.visible*/
            )}
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
