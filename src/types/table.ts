export interface TableState {
  rows: number[];
  cols: number[];
  hoveredColumn: number | null;
}

export interface TableActions {
  addRow: () => void;
  removeRow: (rowIndex: number) => void;
  addColumn: () => void;
  removeColumn: (colIndex: number) => void;
  setHoveredColumn: (index: number | null) => void;
}