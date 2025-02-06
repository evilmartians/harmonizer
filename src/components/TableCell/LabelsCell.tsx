import { DropdownButton } from "../Button/DropdownButton";
import { TextButton } from "../Button/TextButton";

import styles from "./LabelsCell.module.css";
import { TableCell } from "./TableCell";

const LABEL_LEVEL = "Color level";
const LABEL_CONTRACT = "contrast to";

const chromaOptions = [
  { value: "even", label: "Even chroma" },
  { value: "max", label: "Max chroma" },
];

type LabelsCellProps = {
  model: string;
  direction: string;
  chroma: string;
  onMouseEnter: () => void;
  onEditModel: (value: string) => void;
  onEditDirection: (value: string) => void;
  onEditChroma: (value: string) => void;
};

export function LabelsCell({
  model,
  direction,
  chroma,
  onMouseEnter,
  onEditChroma,
}: LabelsCellProps) {
  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        <div className={styles.label}>{LABEL_LEVEL}</div>

        <div className={styles.label}>
          <TextButton className={styles.button} mode="dark" text={model} />
          <div className="flex items-center gap-1">{LABEL_CONTRACT}</div>
          <TextButton className={styles.button} mode="dark" text={direction} />
        </div>

        <div className={styles.label}>
          <DropdownButton
            className={styles.button}
            options={chromaOptions}
            value={chroma}
            onChange={onEditChroma}
          />
        </div>
      </div>
    </TableCell>
  );
}
