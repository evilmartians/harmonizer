import { useCallback, useEffect, useState } from "react";
import styles from "./Background.module.css";
import { usePreventSelection } from "../../hooks/usePreventSelection";
import { useTableConfig } from "../../hooks/useTableConfig";

const CELL_WIDTH = 104;
const MIN_WIDTH = 120;
const PADDING = 16 + CELL_WIDTH; // left page padding + first culumn with labels

interface BarkgroundProps {
  level: number;
}

export function Background({ level: initialLevel }: BarkgroundProps) {
  const { levels } = useTableConfig();
  const [level, setLevel] = useState(initialLevel);
  const [width, setWidth] = useState(
    calculateWidth(initialLevel, levels.length)
  );
  const [isDragging, setIsDragging] = useState(false);

  usePreventSelection(isDragging);

  function calculateWidth(level: number, colCount: number) {
    const maxWidth = PADDING + (colCount + 1) * CELL_WIDTH;
    const calculatedWidth = Math.max(
      MIN_WIDTH,
      Math.min(maxWidth, level * CELL_WIDTH + PADDING)
    );
    return calculatedWidth;
  }

  useEffect(() => {
    setWidth(calculateWidth(level, levels.length));
  }, [level, levels.length]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newLevel = Math.round((e.clientX - PADDING) / CELL_WIDTH);
        setLevel(newLevel);
      }
    },
    [isDragging]
  );

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={styles.container} style={{ width }}>
      <div className={styles.handle} onMouseDown={handleMouseDown} />
    </div>
  );
}
