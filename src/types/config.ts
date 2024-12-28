export interface TableConfig {
  columns: string[];
  rows: string[];
}

export interface TableConfigActions {
  updateConfig: (newConfig: TableConfig) => void;
  getConfig: () => TableConfig;
}