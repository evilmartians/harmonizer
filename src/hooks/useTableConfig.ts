import { useState, useCallback } from "react";
import defaultConfig from "../config/tableConfig.json";
import { Hue, Level, TableConfig, TableConfigActions } from "../types/config";

export function useTableConfig(): TableConfigActions {
  const [config, setConfig] = useState<TableConfig>(defaultConfig);

  const updateConfig = useCallback((newConfig: TableConfig) => {
    setConfig(newConfig);
    localStorage.setItem("tableConfig", JSON.stringify(newConfig));
  }, []);

  const getConfig = useCallback(() => config, [config]);

  // Levels
  const updateLevel = (index: number, level: Level) => {
    const newConfig = {
      ...config,
      levels: config.levels.map((item, i) => (i === index ? level : item)),
    };
    updateConfig(newConfig);
  };

  const addLevel = (level: Level) => {
    const newConfig = {
      ...config,
      levels: [...config.levels, level], // Fixed typo from "leves"
    };
    updateConfig(newConfig);
  };

  const removeLevel = (pos: number) => {
    const newConfig = {
      ...config,
      levels: config.levels.filter((_, index) => index !== pos),
    };
    updateConfig(newConfig);
  };

  // Hues
  const updateHue = (index: number, hue: Hue) => {
    const newConfig = {
      ...config,
      hues: config.hues.map((item, i) => (i === index ? hue : item)),
    };
    updateConfig(newConfig);
  };

  const addHue = (hue: Hue) => {
    const newConfig = {
      ...config,
      hues: [...config.hues, hue],
    };
    updateConfig(newConfig);
  };

  const removeHue = (pos: number) => {
    const newConfig = {
      ...config,
      hues: config.hues.filter((_, index) => index !== pos),
    };
    updateConfig(newConfig);
  };

  // Settings
  const updateModel = (model: string) => {
    const newConfig = {
      ...config,
      settings: { ...config.settings, model },
    };
    updateConfig(newConfig);
  };

  const updateDirection = (direction: string) => {
    const newConfig = {
      ...config,
      settings: { ...config.settings, direction },
    };
    updateConfig(newConfig);
  };

  const updateChroma = (chroma: string) => {
    const newConfig = {
      ...config,
      settings: { ...config.settings, chroma },
    };
    updateConfig(newConfig);
  };

  const updateBgColorLight = (bgColorLight: string) => {
    const newConfig = {
      ...config,
      settings: { ...config.settings, bgColorLight },
    };
    updateConfig(newConfig);
  };

  const updateBgColorDark = (bgColorDark: string) => {
    const newConfig = {
      ...config,
      settings: { ...config.settings, bgColorDark },
    };
    updateConfig(newConfig);
  };

  const updateBgLightLevel = (bgLightLevel: number) => {
    const newConfig = {
      ...config,
      settings: { ...config.settings, bgLightLevel },
    };
    updateConfig(newConfig);
  };

  return {
    levels: config.levels,
    updateLevel,
    addLevel,
    removeLevel,
    hues: config.hues,
    updateHue,
    addHue,
    removeHue,
    settings: config.settings,
    updateModel,
    updateDirection,
    updateChroma,
    updateBgColorLight,
    updateBgColorDark,
    updateBgLightLevel,
    getConfig,
    updateConfig,
  };
}
