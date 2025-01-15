import classNames from "classnames";
import { ActionsRow } from "../TableRow/ActionsRow";
import { HeaderRow } from "../TableRow/HeaderRow";
import { HueRow } from "../TableRow/HueRow";
import styles from "./Table.module.css";

import { ensureNonNullable } from "@/utils/ensureNonNullable";
import { useCallback, useMemo, useState } from "react";
import { useTableConfigContext } from "../../contexts/TableConfigContext";
import { calculateMatrix } from "../../utils/color";

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
    updateModel,
    updateDirection,
    updateChroma,
  } = useTableConfigContext();

  const createLevelConfig = () => {
    const newLevel = ensureNonNullable(
      levels[levels.length - 1],
      "Level not found",
    );
    addLevel(newLevel);
  };

  const createHueConfig = () => {
    const newHue = ensureNonNullable(hues[hues.length - 1], "Hue not found");
    addHue(newHue);
  };

  const onColumnHover = useCallback(
    (i: number | null) => {
      if (i !== hoveredColumn) {
        setHoveredColumn(i);
      }
    },
    [hoveredColumn],
  );

  const colorMatrix = useMemo(
    () => calculateMatrix(levels, hues, settings),
    [hues, levels, settings],
  );

  const editableChroma = settings.chroma === "custom";

  return (
    <div
      className={classNames(className, styles.container)}
      onMouseLeave={() => onColumnHover(null)}
    >
      <HeaderRow
        settings={settings}
        levels={levels}
        tints={ensureNonNullable(colorMatrix.hues[0], "Hue header not found")}
        model={settings.model}
        bgLightLevel={settings.bgLightLevel}
        editableChroma={editableChroma}
        onLevelHover={onColumnHover}
        onEditModel={updateModel}
        onEditDirection={updateDirection}
        onEditChroma={updateChroma}
        onAddLevel={createLevelConfig}
        onLevelHue={updateLevel}
      />
      {hues.map((hue, i) => (
        <HueRow
          key={`hue-row-${hue.name}-${hue.angle}-${i}`}
          hue={hue}
          colorRow={ensureNonNullable(colorMatrix.hues[i], "Hue row not found")}
          bgLightLevel={settings.bgLightLevel}
          onLevelHover={onColumnHover}
          onRemoveHue={() => removeHue(i)}
          onEditHue={(hue) => updateHue(i, hue)}
        />
      ))}
      <ActionsRow
        levels={levels}
        bgLightLevel={settings.bgLightLevel}
        hoveredColumn={hoveredColumn}
        onAddHue={createHueConfig}
        onRemoveLevel={removeLevel}
        onColumnHover={onColumnHover}
      />
    </div>
  );
}
