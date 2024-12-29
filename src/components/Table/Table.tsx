import { HueRow } from "../TableRow/HueRow";
import { HeaderRow } from "../TableRow/HeaderRow";
import { ActionsRow } from "../TableRow/ActionsRow";
import styles from "./Table.module.css";
import classNames from "classnames";
import { useTableConfig } from "../../hooks/useTableConfig";
import { useCallback, useState } from "react";

interface TableProps {
  className: string;
  lightLevel: number;
}

export function Table({ className, lightLevel }: TableProps) {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const { levels, addLevel, removeLevel, hues, addHue, removeHue, settings } =
    useTableConfig();

  const createLevelConfig = () => {
    const newLevel = { name: "Level NEW", contrast: 0, chroma: 0 };
    addLevel(newLevel);
  };

  const createHueConfig = () => {
    const newHue = { name: "Hue NEW", degree: 0 };
    addHue(newHue);
  };

  const onColumnHover = useCallback(
    (i: number | null) => {
      if (i !== hoveredColumn) {
        setHoveredColumn(i);
      }
    },
    [hoveredColumn]
  );

  return (
    <div
      className={classNames(className, styles.container)}
      onMouseLeave={() => onColumnHover(null)}
    >
      <HeaderRow
        levels={levels}
        model={settings.model}
        lightLevel={lightLevel}
        onAddLevel={createLevelConfig}
        onLevelHover={onColumnHover}
      />
      {hues.map((hue, i) => (
        <HueRow
          key={`row-${i}`}
          hue={hue}
          settings={settings}
          levels={levels}
          onLevelHover={onColumnHover}
          onRemoveHue={() => removeHue(hue.degree)}
        />
      ))}
      <ActionsRow
        levels={levels}
        onAddHue={createHueConfig}
        hoveredColumn={hoveredColumn}
        onRemoveLevel={(name: string) => removeLevel(name)}
        onColumnHover={onColumnHover}
      />
    </div>
  );
}
