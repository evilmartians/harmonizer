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

  const {
    levels: confLeveles,
    hues: confHues,
    settings: settings,
  } = getConfig();

  // Levels
  const [levels, setLevels] = useState<Level[]>(confLeveles);

  const editLevel = (index: number, level: Level) => {
    setLevels((prev) => prev.map((item, i) => (i === index ? level : item)));
    const newConfig = {
      ...getConfig(),
      levels: getConfig().levels.map((item, i) => (i === index ? level : item)),
    };
    updateConfig(newConfig);
  };

  const addLevel = (level: Level) => {
    setLevels((prev) => [...prev, level]);
    const newConfig = {
      ...getConfig(),
      leves: [...getConfig().levels, level],
    };
    updateConfig(newConfig);
  };

  const removeLevel = (name: string) => {
    console.log("removeLevel", name);
    setLevels((prev) => prev.filter((level) => level.name !== name));
    const newConfig = {
      ...getConfig(),
      levels: getConfig().levels.filter((level) => level.name !== name),
    };
    console.log("newConfig", newConfig);
    updateConfig(newConfig);
  };

  // Hues
  const [hues, setHues] = useState<Hue[]>(confHues);

  const editHue = (index: number, hue: Hue) => {
    setHues((prev) => prev.map((item, i) => (i === index ? hue : item)));
    const newConfig = {
      ...getConfig(),
      hues: getConfig().hues.map((item, i) => (i === index ? hue : item)),
    };
    updateConfig(newConfig);
  };

  const addHue = (hue: Hue) => {
    setHues((prev) => [...prev, hue]);
    const newConfig = {
      ...getConfig(),
      hues: [...getConfig().hues, hue],
    };
    updateConfig(newConfig);
  };

  const removeHue = (degree: number) => {
    console.log("removeHue", degree);
    setHues((prev) => prev.filter((hue) => hue.degree !== degree));
    const newConfig = {
      ...getConfig(),
      hues: getConfig().hues.filter((hue) => hue.degree !== degree),
    };
    console.log("newConfig", newConfig);
    updateConfig(newConfig);
  };

  // Settings
  const updateModel = (model: string) => {
    const newConfig = {
      ...getConfig(),
      settings: { ...settings, model },
    };
    updateConfig(newConfig);
  };

  const updateDirection = (direction: string) => {
    const newConfig = {
      ...getConfig(),
      settings: { ...settings, direction },
    };
    updateConfig(newConfig);
  };

  const updateChroma = (chroma: string) => {
    const newConfig = {
      ...getConfig(),
      settings: { ...settings, chroma },
    };
    updateConfig(newConfig);
  };

  const updateBgColorLight = (bgColorLight: string) => {
    const newConfig = {
      ...getConfig(),
      settings: { ...settings, bgColorLight },
    };
    updateConfig(newConfig);
  };

  const updateBgColorDark = (bgColorDark: string) => {
    const newConfig = {
      ...getConfig(),
      settings: { ...settings, bgColorDark },
    };
    updateConfig(newConfig);
  };

  const updateLightLevel = (lightLevel: number) => {
    const newConfig = {
      ...getConfig(),
      settings: { ...settings, lightLevel },
    };
    updateConfig(newConfig);
  };

  return {
    levels,
    editLevel,
    addLevel,
    removeLevel,
    hues,
    editHue,
    addHue,
    removeHue,
    settings,
    updateModel,
    updateDirection,
    updateChroma,
    updateBgColorLight,
    updateBgColorDark,
    updateLightLevel,
    getConfig,
  };
}
