import { useCallback, type PointerEvent } from "react";

import type { WindowSize } from "@shared/types";

import { invariant } from "@core/utils/assertions/invariant";

export const useResizeHandle = (onResize: (size: WindowSize) => void) => {
  const handleResize = useCallback(
    (e: DocumentEventMap["pointermove"]) => {
      onResize({ width: Math.floor(e.clientX), height: Math.floor(e.clientY) });
    },
    [onResize],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const element = e.currentTarget;

      invariant(element, "Resize handle element is null");

      element.addEventListener("pointermove", handleResize, { passive: true });
      element.setPointerCapture(e.pointerId);
    },
    [onResize],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const element = e.currentTarget;

      invariant(element, "Resize handle element is null");

      element.removeEventListener("pointermove", handleResize);
      element.releasePointerCapture(e.pointerId);
    },
    [onResize],
  );

  return { onPointerDown: handlePointerDown, onPointerUp: handlePointerUp };
};
