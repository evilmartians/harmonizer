import { useSubscribe } from "@spred/react";

import { DropdownButton } from "../Button/DropdownButton";
import { TextButton } from "../Button/TextButton";

import styles from "./LabelsCell.module.css";
import { TableCell } from "./TableCell";

import { $contrastModel, $directionMode, $chromaMode, updateChromaMode } from "@/stores/settings";
import type { ChromaMode } from "@/types";

const LABEL_LEVEL = "Color level";
const LABEL_CONTRACT = "contrast to";

const chromaOptions = [
  { value: "even", label: "Even chroma" },
  { value: "max", label: "Max chroma" },
];

type LabelsCellProps = {
  onMouseEnter: () => void;
};

export function LabelsCell({ onMouseEnter }: LabelsCellProps) {
  const contrastModel = useSubscribe($contrastModel);
  const directionMode = useSubscribe($directionMode);
  const chromaMode = useSubscribe($chromaMode);

  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        <div className={styles.label}>{LABEL_LEVEL}</div>

        <div className={styles.label}>
          <TextButton className={styles.button} mode="dark" text={contrastModel} />
          <div className="flex items-center gap-1">{LABEL_CONTRACT}</div>
          <TextButton className={styles.button} mode="dark" text={directionMode} />
        </div>

        <div className={styles.label}>
          <DropdownButton
            className={styles.button}
            options={chromaOptions}
            value={chromaMode}
            onChange={(value) => updateChromaMode(value as ChromaMode)}
          />
        </div>
      </div>
    </TableCell>
  );
}
