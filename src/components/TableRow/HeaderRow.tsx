import { useSubscribe } from "@spred/react";

import { ActionCell } from "../TableCell/ActionCell";
import { LabelsCell } from "../TableCell/LabelsCell";
import { LevelCell } from "../TableCell/LevelCell";

import styles from "./HeaderRow.module.css";

import { $levelIds, insertLevel } from "@/stores/colors";
import { $bgLightStart } from "@/stores/settings";
import { resetHoveredColumn, setHoveredColumn } from "@/stores/ui";

const HINT_ADD_LEVEL = "Add new color level";

export function HeaderRow() {
  const levelsIds = useSubscribe($levelIds);
  const bgLightStart = useSubscribe($bgLightStart);

  return (
    <div className={styles.container}>
      <LabelsCell onMouseEnter={resetHoveredColumn} />
      {levelsIds.map((levelId, i) => {
        const invertedColor = i < bgLightStart;

        return (
          <LevelCell
            key={levelId}
            levelId={levelId}
            mode={invertedColor ? "dark" : "light"}
            onMouseEnter={() => setHoveredColumn(i)}
          />
        );
      })}
      <ActionCell
        title={HINT_ADD_LEVEL}
        variant="level"
        mode="light"
        onClick={() => insertLevel()}
        onMouseEnter={resetHoveredColumn}
      />
    </div>
  );
}
