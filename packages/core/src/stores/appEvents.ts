import type { HueId, LevelId } from "@core/types";
import { EventTargetTransport } from "@core/utils/communication-channel/transports/EventTargetTransport";

export type AppEvents = {
  levelAdded: LevelId;
  hueAdded: HueId;
};

export const appEvents = EventTargetTransport.createChannel<AppEvents, AppEvents>();
