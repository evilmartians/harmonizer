import { createEventTargetTransport, createTypedChannel } from "typed-channel";

import type { HueId, LevelId } from "@core/types";

export type AppEvents = {
  levelAdded: LevelId;
  hueAdded: HueId;
};

const eventTargetTransport = createEventTargetTransport<AppEvents>();
export const appEvents = createTypedChannel(eventTargetTransport);
