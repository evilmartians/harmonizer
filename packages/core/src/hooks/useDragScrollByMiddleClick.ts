import { handleDragScrollByMiddleClick } from "@core/utils/dom/handleDragScrollByMiddleClick";
import { type RefObject, useEffect } from "react";

export function useDragScrollByMiddleClick(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    return handleDragScrollByMiddleClick(ref.current);
  }, []);
}
