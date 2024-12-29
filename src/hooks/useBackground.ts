import { useState, useCallback } from "react";
import { usePreventSelection } from "./usePreventSelection";
import { useTableConfig } from "./useTableConfig";

const CELL_WIDTH = 104;
const MIN_WIDTH = 120;
const PADDING = 16 + CELL_WIDTH; // left page padding + first column with labels

export function useBackground() {
  const { levels } = useTableConfig();
  const initialLevel = Math.floor(levels.length / 2);
  const [lightLevel, setLightLevel] = useState(initialLevel);

  const calculateWidth = useCallback(
    (level: number) => {
      const maxWidth = PADDING + levels.length * CELL_WIDTH;
      return Math.max(
        MIN_WIDTH,
        Math.min(maxWidth, level * CELL_WIDTH + PADDING)
      );
    },
    [levels.length]
  );
  const [width, setWidth] = useState(() => calculateWidth(initialLevel));

  const [isDragging, setIsDragging] = useState(false);

  usePreventSelection(isDragging);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const newLevel = Math.round((e.clientX - PADDING) / CELL_WIDTH);
      console.log(
        "handleMouseMove",
        e.clientX,
        e.clientX,
        "newLevel",
        newLevel
      );
      setLightLevel(newLevel);
      setWidth(calculateWidth(newLevel));
    },
    [calculateWidth]
  );

  const handleDragStart = useCallback(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    setIsDragging(true);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  return {
    lightLevel,
    width,
    startDrag: handleDragStart,
  };
}
