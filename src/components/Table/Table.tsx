import { HueRow } from "../TableRow/HueRow";
import { HeaderRow } from "../TableRow/HeaderRow";
import { ActionsRow } from "../TableRow/ActionsRow";
import styles from "./Table.module.css";
import classNames from "classnames";

import { useCallback, useMemo, useState } from "react";
import { calculateMatrix } from "../../utils/colorUtils";
import { useTableConfigContext } from "../../contexts/TableConfigContext";

interface TableProps {
  className: string;
}

export function Table({ className }: TableProps) {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const { levels, addLevel, removeLevel, hues, addHue, removeHue, settings } =
    useTableConfigContext();

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

  const colorMatrix = useMemo(
    () => calculateMatrix(levels, hues, settings),
    [hues, levels, settings]
  );

  return (
    <div
      className={classNames(className, styles.container)}
      onMouseLeave={() => onColumnHover(null)}
    >
      <HeaderRow
        levels={levels}
        model={settings.model}
        lightLevel={settings.lightLevel}
        onAddLevel={createLevelConfig}
        onLevelHover={onColumnHover}
      />
      {hues.map((hue, i) => (
        <HueRow
          key={`row-${i}`}
          hue={hue}
          colorRow={colorMatrix.hues[i]}
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
