import { useEffect, useEffectEvent } from "react";

import { appEvents, type AppEvents } from "@core/stores/appEvents";

export function useAppEvent<E extends keyof AppEvents>(
  event: E,
  callback: (data: AppEvents[E]) => void,
) {
  const onEvent = useEffectEvent(callback);

  useEffect(() => {
    return appEvents.on(event, (data) => onEvent(data));
  }, [event]);
}
