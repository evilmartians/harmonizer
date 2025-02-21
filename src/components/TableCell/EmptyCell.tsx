import { memo } from "react";

import { TableCell } from "./TableCell";

type EmptyCellProps = {
  onMouseEnter: VoidFunction;
};

export const EmptyCell = memo(function EmptyCell({ onMouseEnter }: EmptyCellProps) {
  return <TableCell onMouseEnter={onMouseEnter} />;
});
