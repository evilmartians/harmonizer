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
  const {
    levels,
    updateLevel,
    addLevel,
    removeLevel,
    hues,
    updateHue,
    addHue,
    removeHue,
    settings,
  } = useTableConfigContext();

  const createLevelConfig = () => {
    const newLevel = levels[levels.length - 1];
    addLevel(newLevel);
  };

  const createHueConfig = () => {
    const newHue = hues[hues.length - 1];
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

  const editableChroma = settings.chroma === "custom";

  return (
    <div
      className={classNames(className, styles.container)}
      onMouseLeave={() => onColumnHover(null)}
    >
      <HeaderRow
        levels={levels}
        tints={colorMatrix.hues[0]}
        model={settings.model}
        lightLevel={settings.lightLevel}
        editableChroma={editableChroma}
        onAddLevel={createLevelConfig}
        onLevelHover={onColumnHover}
        onLevelHue={updateLevel}
      />
      {hues.map((hue, i) => (
        <HueRow
          key={`hue-row-${hue.name}-${hue.degree}-${i}`}
          hue={hue}
          colorRow={colorMatrix.hues[i]}
          lightLevel={settings.lightLevel}
          onLevelHover={onColumnHover}
          onRemoveHue={() => removeHue(i)}
          onEditHue={(hue) => updateHue(i, hue)}
        />
      ))}
      <ActionsRow
        levels={levels}
        lightLevel={settings.lightLevel}
        hoveredColumn={hoveredColumn}
        onAddHue={createHueConfig}
        onRemoveLevel={removeLevel}
        onColumnHover={onColumnHover}
      />
    </div>
  );
}
