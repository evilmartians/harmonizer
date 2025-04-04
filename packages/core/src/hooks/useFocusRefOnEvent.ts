import { appEvents, type AppEvents } from "@core/stores/appEvents";
import { useEffect, useRef } from "react";

export function useAppEvent<E extends keyof AppEvents>(
  event: E,
  callback: (data: AppEvents[E]) => void,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return appEvents.on(event, callbackRef.current);
  }, [event]);
}
