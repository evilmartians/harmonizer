export interface Level {
  name: string;
  contrast: number;
  chroma: number;
}

export interface Hue {
  name: string;
  angle: number;
}

export interface Settings {
  model: string;
  direction: string;
  chroma: string;
  bgLightLevel: number;
  bgColorLight: string;
  bgColorDark: string;
}

export interface TableConfig {
  levels: Level[];
  hues: Hue[];
  settings: Settings;
}

export interface TableConfigActions {
  levels: Level[];
  updateLevel: (index: number, level: Level) => void;
  addLevel: (level: Level) => void;
  removeLevel: (pos: number) => void;
  hues: Hue[];
  updateHue: (index: number, hue: Hue) => void;
  addHue: (hue: Hue) => void;
  removeHue: (hueDeg: number) => void;
  settings: Settings;
  updateModel: (model: string) => void;
  updateDirection: (direction: string) => void;
  updateChroma: (chroma: string) => void;
  updateBgColorLight: (color: string) => void;
  updateBgColorDark: (color: string) => void;
  updateBgLightLevel: (bgLightLevel: number) => void;
  getConfig: () => TableConfig;
  updateConfig: (config: TableConfig) => void;
}
