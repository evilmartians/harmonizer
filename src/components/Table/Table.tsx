import { HueRow } from "../TableRow/HueRow";
import { HeaderRow } from "../TableRow/HeaderRow";
import { ActionsRow } from "../TableRow/ActionsRow";
import { useTable } from "../../hooks/useTable";
import styles from "./Table.module.css";
import classNames from "classnames";

interface TableProps {
  className: string;
}

export function Table({ className }: TableProps) {
  const {
    rows,
    cols,
    hoveredColumn,
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    setHoveredColumn,
  } = useTable();

  return (
    <div
      className={classNames(className, styles.container)}
      onMouseLeave={() => setHoveredColumn(null)}
    >
      <HeaderRow
        cols={cols}
        onAddColumn={addColumn}
        onColumnHover={setHoveredColumn}
      />
      {rows.map((rowIndex) => (
        <>
          <HueRow
            key={`row-${rowIndex}`}
            rowIndex={rowIndex}
            cols={cols}
            onColumnHover={setHoveredColumn}
            onRemoveRow={() => removeRow(rowIndex)}
          />
        </>
      ))}
      <ActionsRow
        cols={cols}
        onAddRow={addRow}
        hoveredColumn={hoveredColumn}
        onRemoveColumn={removeColumn}
        onColumnHover={setHoveredColumn}
      />
    </div>
  );
}
