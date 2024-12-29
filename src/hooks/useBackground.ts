import { useState, useCallback } from "react";

const CELL_WIDTH = 104;
const MIN_WIDTH = 120;
const PADDING = 16 + CELL_WIDTH; // left page padding + first culumn with labels

interface UseBackgroundOptions {
  initialLevel?: number;
  colsCount: number;
}

export function useBackground({
  initialLevel = 4,
  colsCount,
}: UseBackgroundOptions) {
  const [level, setLevel] = useState(initialLevel);
  const [width, setWidth] = useState(() => calculateWidth(initialLevel));

  function calculateWidth(level: number) {
    const maxWidth = PADDING + (colsCount + 1) * CELL_WIDTH;
    return Math.max(
      MIN_WIDTH,
      Math.min(maxWidth, level * CELL_WIDTH + PADDING)
    );
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const maxWidth = PADDING + (colsCount + 1) * CELL_WIDTH;
      const newLevel = Math.round(e.clientX / CELL_WIDTH);
      const newWidth = Math.max(
        MIN_WIDTH,
        Math.min(maxWidth, newLevel * CELL_WIDTH + PADDING)
      );
      setLevel(newLevel);
      setWidth(newWidth);
    },
    [colsCount]
  );

  const handleDragStart = useCallback(() => {
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  return {
    level,
    width,
    startDrag: handleDragStart,
    setLevel,
  };
}
