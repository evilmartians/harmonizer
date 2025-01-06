import { useState, useCallback, useEffect } from "react";
import { usePreventSelection } from "./usePreventSelection";
import { useTableConfigContext } from "../contexts/TableConfigContext";

const CELL_WIDTH = 104;
const MIN_WIDTH = 120;
const PADDING = 24 + CELL_WIDTH; // left page padding + first column with labels

export function useBackground() {
  const { levels, settings, updateLightLevel } = useTableConfigContext();
  const initialLevel = settings.lightLevel;

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

  useEffect(() => {
    setWidth(calculateWidth(settings.lightLevel));
  }, [settings.lightLevel, calculateWidth]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const newLevel = Math.round((e.clientX - PADDING) / CELL_WIDTH);
      updateLightLevel(newLevel);
      setWidth(calculateWidth(newLevel));
    },
    [calculateWidth, updateLightLevel]
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
    width,
    startDrag: handleDragStart,
  };
}
