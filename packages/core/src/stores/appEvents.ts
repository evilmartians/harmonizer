import { createNanoEvents } from "nanoevents";

export type AppEvents = {
  levelAdded: (levelId: string) => void;
  hueAdded: (hueId: string) => void;
};

export const appEvents = createNanoEvents<AppEvents>();
