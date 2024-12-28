import { useState, useCallback } from 'react';
import defaultConfig from '../config/tableConfig.json';
import { TableConfig, TableConfigActions } from '../types/config';

export function useTableConfig(): TableConfigActions {
  const [config, setConfig] = useState<TableConfig>(defaultConfig);

  const updateConfig = useCallback((newConfig: TableConfig) => {
    setConfig(newConfig);
    // Optional: Save to localStorage or other persistence
    localStorage.setItem('tableConfig', JSON.stringify(newConfig));
  }, []);

  const getConfig = useCallback(() => config, [config]);

  return {
    updateConfig,
    getConfig
  };
}