import { throttle } from "es-toolkit";

import { isRtl } from "@core/utils/dom/isRtlDirection";

type SnappedHorizontalDragOptions = {
  element: HTMLElement;
  snapWidth: number;
  threshold?: number;
  onChange: (offset: number) => boolean;
  onStart?: VoidFunction;
  onEnd?: VoidFunction;
};
export function handleSnappedHorizontalDrag({
  element,
  snapWidth,
  threshold = 0.5,
  onChange,
  onStart,
  onEnd,
}: SnappedHorizontalDragOptions) {
  let startX = 0;

  function handlePointerDown(e: PointerEvent) {
    startX = e.clientX;
    onStart?.();
    element.setPointerCapture(e.pointerId);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
  }

  const handlePointerMove = throttle((e: PointerEvent) => {
    const rtlFactor = isRtl() ? -1 : 1;
    const deltaX = e.clientX - startX;
    const rawOffset = deltaX / snapWidth;
    const offsetCells = Math.abs(rawOffset) >= threshold ? Math.round(rawOffset) * rtlFactor : 0;

    if (offsetCells === 0) return;
    if (onChange(offsetCells)) {
      startX += offsetCells * snapWidth * rtlFactor;
    }
  }, 50);

  function handlePointerUp(e: PointerEvent) {
    onEnd?.();
    element.releasePointerCapture(e.pointerId);
    element.removeEventListener("pointermove", handlePointerMove);
    element.removeEventListener("pointerup", handlePointerUp);
  }

  element.addEventListener("pointerdown", handlePointerDown);

  return () => {
    element.removeEventListener("pointerdown", handlePointerDown);
    element.removeEventListener("pointermove", handlePointerMove);
    element.removeEventListener("pointerup", handlePointerUp);
  };
}
