import { ensureNonNullable } from "@core/utils/assertions/ensureNonNullable";
import type { WindowSize } from "@shared/types";
import { useCallback, useRef, type PointerEvent } from "react";

import styles from "./ResizeWindowHandle.module.css";

export type ResizeWindowHandleProps = { onResize: (size: WindowSize) => void };

export function ResizeWindowHandle({ onResize }: ResizeWindowHandleProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const resizeWindow = useCallback(
    (e: DocumentEventMap["pointermove"]) => {
      const size = {
        width: Math.max(50, Math.floor(e.clientX + 5)),
        height: Math.max(50, Math.floor(e.clientY + 5)),
      };

      onResize(size);
    },
    [onResize],
  );
  const handlePointerDown = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    const button = ensureNonNullable(buttonRef.current, "ResizeWindowHandle ref is null");

    button.addEventListener("pointermove", resizeWindow);
    button.setPointerCapture(e.pointerId);
  }, []);
  const handlePointerUp = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    const button = ensureNonNullable(buttonRef.current, "ResizeWindowHandle ref is null");

    button.removeEventListener("pointermove", resizeWindow);
    button.releasePointerCapture(e.pointerId);
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Resize window"
      className={styles.button}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <svg viewBox="0 0 16 16">
        <path
          fill="currentColor"
          d="M4.226 16H1L16 1v3.226L4.226 16ZM11.226 16H8l8-8v3.226L11.226 16Z"
        />
      </svg>
    </button>
  );
}
