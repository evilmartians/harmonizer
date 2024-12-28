import { useState } from "react";
import { TableState, TableActions } from "../types/table";
import { useTableConfig } from "./useTableConfig";

export function useTable(): TableState & TableActions {
  const { getConfig, updateConfig } = useTableConfig();
  const config = getConfig();

  const [rows, setRows] = useState<number[]>(
    Array.from({ length: config.rows.length }, (_, i) => i + 1)
  );

  const [cols, setCols] = useState<number[]>(
    Array.from({ length: config.columns.length }, (_, i) => i + 1)
  );

  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  const addRow = () => {
    const newRowIndex = Math.max(...rows) + 1;
    setRows((prev) => [...prev, newRowIndex]);
    const newConfig = {
      ...getConfig(),
      rows: [...getConfig().rows, `Hue ${newRowIndex}`],
    };
    updateConfig(newConfig);
  };

  const removeRow = (rowIndex: number) => {
    setRows((prev) => prev.filter((index) => index !== rowIndex));
    const newConfig = {
      ...getConfig(),
      rows: getConfig().rows.filter((_, i) => i + 1 !== rowIndex),
    };
    updateConfig(newConfig);
  };

  const addColumn = () => {
    const newColIndex = Math.max(...cols) + 1;
    setCols((prev) => [...prev, newColIndex]);
    const newConfig = {
      ...getConfig(),
      columns: [...getConfig().columns, `Level ${newColIndex}`],
    };
    updateConfig(newConfig);
  };

  const removeColumn = (colIndex: number) => {
    setCols((prev) => prev.filter((index) => index !== colIndex));
    const newConfig = {
      ...getConfig(),
      columns: getConfig().columns.filter((_, i) => i + 1 !== colIndex),
    };
    updateConfig(newConfig);
  };

  return {
    rows,
    cols,
    hoveredColumn,
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    setHoveredColumn,
  };
}
