import { type ReactNode, createContext, useContext } from "react";

import { useTableConfig } from "../hooks/useTableConfig";
import type { TableConfigActions } from "../types/config";

const TableConfigContext = createContext<TableConfigActions | null>(null);

export function TableConfigProvider({ children }: { children: ReactNode }) {
  const tableConfigState = useTableConfig();

  return (
    <TableConfigContext.Provider value={tableConfigState}>{children}</TableConfigContext.Provider>
  );
}

export function useTableConfigContext(): TableConfigActions {
  const context = useContext(TableConfigContext);
  if (!context) {
    throw new Error("useTableConfigContext must be used within a TableConfigProvider");
  }
  return context;
}
