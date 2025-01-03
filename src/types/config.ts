export interface Level {
  name: string;
  contrast: number;
  chroma: number;
}

export interface Hue {
  name: string;
  degree: number;
}

export interface Settings {
  model: string;
  direction: string;
  chroma: string;
  lightLevel: number;
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
  addLevel: (level: Level) => void;
  removeLevel: (levelName: string) => void;
  hues: Hue[];
  addHue: (hue: Hue) => void;
  removeHue: (hueDeg: number) => void;
  settings: Settings;
  updateModel: (model: string) => void;
  updateDirection: (direction: string) => void;
  updateChroma: (chroma: string) => void;
  updateBgColorLight: (color: string) => void;
  updateBgColorDark: (color: string) => void;
  updateLightLevel: (lightLevel: number) => void;
}
