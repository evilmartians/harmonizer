import { type RefObject, useEffect } from "react";

import { handleDragScrollByMiddleClick } from "@core/utils/dom/handleDragScrollByMiddleClick";

export function useDragScrollByMiddleClick(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    return handleDragScrollByMiddleClick(ref.current);
  }, []);
}
