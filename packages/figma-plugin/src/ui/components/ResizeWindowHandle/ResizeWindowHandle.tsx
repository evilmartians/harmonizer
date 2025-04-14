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
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11 0C11.5523 0 12 0.447715 12 1C12 7.07513 7.07513 12 1 12C0.447715 12 0 11.5523 0 11C0 10.4477 0.447715 10 1 10C5.97056 10 10 5.97056 10 1C10 0.447715 10.4477 0 11 0Z"
          fill="#808080"
        />
      </svg>
    </button>
  );
}
