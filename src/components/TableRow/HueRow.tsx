import { useSubscribe } from "@spred/react";
import { memo } from "react";

import { ActionCell } from "../TableCell/ActionCell";
import { ColorCell } from "../TableCell/ColorCell";
import { HueCell } from "../TableCell/HueCell";

import styles from "./HueRow.module.css";

import { $levelIds, getHue, removeHue } from "@/stores/colors";
import { $bgLightStart } from "@/stores/settings";
import { resetHoveredColumn, setHoveredColumn } from "@/stores/ui";
import type { HueId } from "@/types";

const HINT_REMOVE_HUE = "Remove color";

type HueRowProps = {
  hueId: HueId;
};

export const HueRow = memo(function HueRow({ hueId }: HueRowProps) {
  const levelIds = useSubscribe($levelIds);
  const bgLightStart = useSubscribe($bgLightStart);

  return (
    <div className={styles.container}>
      <HueCell hueId={hueId} onMouseEnter={resetHoveredColumn} />
      {levelIds.map((levelId, i) => (
        <ColorCell
          key={levelId}
          levelId={levelId}
          hueId={hueId}
          mode={i < bgLightStart ? "light" : "dark"}
          onMouseEnter={() => setHoveredColumn(i)}
        />
      ))}
      <ActionCell
        title={`${HINT_REMOVE_HUE} “${getHue(hueId).$name.value}”`}
        variant="remove"
        mode="light"
        buttonClassName={styles.actionCellButton}
        onClick={() => removeHue(hueId)}
        onMouseEnter={resetHoveredColumn}
      />
    </div>
  );
});
