import type { Level } from "../../types/config";
import { ActionCell } from "../TableCell/ActionCell";
import { EmptyCell } from "../TableCell/EmptyCell";
import styles from "./ActionsRow.module.css";

const HINT_ADD_HUE = "Add new color";
const HINT_REMOVE_LEVEL = "Remove color level";

interface ActionsRowProps {
  levels: Level[];
  bgLightLevel: number;
  hoveredColumn: number | null;
  onAddHue: () => void;
  onColumnHover: (index: number | null) => void;
  onRemoveLevel: (pos: number) => void;
}

export function ActionsRow({
  levels,
  bgLightLevel,
  hoveredColumn,
  onAddHue,
  onRemoveLevel,
  onColumnHover,
}: ActionsRowProps) {
  return (
    <div className={styles.container}>
      <ActionCell
        className={styles.addButton}
        title={HINT_ADD_HUE}
        variant="hue"
        mode="dark"
        onClick={onAddHue}
        onMouseEnter={() => onColumnHover(null)}
      />
      {levels.map((level, i) => (
        <ActionCell
          key={`action-${level.name}`}
          title={`${HINT_REMOVE_LEVEL} “${level.name}”`}
          variant="remove"
          mode={i >= bgLightLevel ? "light" : "dark"}
          buttonClassName={hoveredColumn === i ? "opacity-100" : "opacity-0"}
          onClick={() => onRemoveLevel(i)}
          onMouseEnter={() => onColumnHover(i)}
        />
      ))}
      <EmptyCell onMouseEnter={() => onColumnHover(null)} />
    </div>
  );
}
