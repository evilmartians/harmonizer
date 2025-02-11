import classNames from "classnames";

import { AddColumnButton } from "../Button/AddColumnButton";
import { AddRowButton } from "../Button/AddRowButton";
import { RemoveButton } from "../Button/RemoveButton";

import styles from "./ActionCell.module.css";
import { TableCell } from "./TableCell";

type ActionCellProps = {
  className?: string;
  buttonClassName?: string;
  title: string;
  variant: "level" | "hue" | "remove";
  mode: "light" | "dark";
  onClick: () => void;
  onMouseEnter: () => void;
};

export function ActionCell({
  className,
  buttonClassName,
  title,
  variant,
  mode,
  onClick,
  onMouseEnter,
}: ActionCellProps) {
  return (
    <TableCell className={className} onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        {variant === "hue" ? (
          <AddRowButton mode={mode} title={title} onClick={onClick} />
        ) : variant === "remove" ? (
          <RemoveButton
            className={classNames(styles.button, buttonClassName)}
            mode={mode}
            title={title}
            onClick={onClick}
          />
        ) : (
          <AddColumnButton mode={mode} onClick={onClick} title={title} />
        )}
      </div>
    </TableCell>
  );
}
