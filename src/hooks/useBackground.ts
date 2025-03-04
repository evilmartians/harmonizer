import { useSubscribe } from "@spred/react";
import { useCallback, useEffect, useState } from "react";

import { usePreventSelection } from "./usePreventSelection";

import { $levelIds } from "@/stores/colors";
import { $bgLightStart, updateBgLightStart } from "@/stores/settings";
import { bgLightStart } from "@/types";

const CELL_WIDTH = 104;
const MIN_WIDTH = 120;
const PADDING = 24 + CELL_WIDTH; // left page padding + first column with labels

export function useBackground() {
  const levelIds = useSubscribe($levelIds);
  const bgLightsStartsAt = useSubscribe($bgLightStart);

  const calculateWidth = useCallback(
    (level: number) => {
      const maxWidth = PADDING + levelIds.length * CELL_WIDTH;
      return Math.max(MIN_WIDTH, Math.min(maxWidth, level * CELL_WIDTH + PADDING));
    },
    [levelIds],
  );
  const [width, setWidth] = useState(() => calculateWidth(bgLightsStartsAt));

  const [isDragging, setIsDragging] = useState(false);

  usePreventSelection(isDragging);

  useEffect(() => {
    setWidth(calculateWidth(bgLightsStartsAt));
  }, [bgLightsStartsAt, calculateWidth]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const newLevel = bgLightStart(Math.round((e.clientX - PADDING) / CELL_WIDTH));

      setWidth(calculateWidth(newLevel));
      if ($bgLightStart.value !== newLevel) {
        updateBgLightStart(newLevel);
      }
    },
    [calculateWidth],
  );

  const handleDragStart = useCallback(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("mouseup", handleMouseUp);
    };

    setIsDragging(true);
    globalThis.addEventListener("mousemove", handleMouseMove);
    globalThis.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  return {
    width,
    startDrag: handleDragStart,
  };
}
