import { TableCell } from "./TableCell";

interface EmptyCellProps {
  onMouseEnter: VoidFunction;
}

export function EmptyCell({ onMouseEnter }: EmptyCellProps) {
  return <TableCell onMouseEnter={onMouseEnter} />;
}
