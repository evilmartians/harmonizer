import { HueRow } from "../TableRow/HueRow";
import { HeaderRow } from "../TableRow/HeaderRow";
import { ActionsRow } from "../TableRow/ActionsRow";
import styles from "./Table.module.css";
import classNames from "classnames";
import { useTableConfig } from "../../hooks/useTableConfig";
import { useState } from "react";

interface TableProps {
  className: string;
}

export function Table({ className }: TableProps) {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const { levels, addLevel, removeLevel, hues, addHue, removeHue, settings } =
    useTableConfig();

  const createLevelConfig = () => {
    const newLevel = { name: "Level NEW", contrast: 0, chroma: 0 };
    console.log("createLevelConfig", newLevel);
    addLevel(newLevel);
  };

  const createHueConfig = () => {
    const newHue = { name: "Hue NEW", degree: 0 };
    console.log("createHueConfig", newHue);
    addHue(newHue);
  };

  return (
    <div
      className={classNames(className, styles.container)}
      onMouseLeave={() => setHoveredColumn(null)}
    >
      <HeaderRow
        levels={levels}
        model={settings.model}
        onAddLevel={createLevelConfig}
        onLevelHover={setHoveredColumn}
      />
      {hues.map((hue, i) => (
        <HueRow
          key={`row-${i}`}
          hue={hue}
          levels={levels}
          onLevelHover={setHoveredColumn}
          onRemoveHue={() => removeHue(hue.degree)}
        />
      ))}
      <ActionsRow
        levels={levels}
        onAddHue={createHueConfig}
        hoveredColumn={hoveredColumn}
        onRemoveLevel={(name: string) => removeLevel(name)}
        onColumnHover={setHoveredColumn}
      />
    </div>
  );
}
