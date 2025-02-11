import { TableCell } from "./TableCell";

type EmptyCellProps = {
  onMouseEnter: VoidFunction;
};

export function EmptyCell({ onMouseEnter }: EmptyCellProps) {
  return <TableCell onMouseEnter={onMouseEnter} />;
}
