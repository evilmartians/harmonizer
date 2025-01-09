import { TextButton } from "../Button/TextButton";
import styles from "./LabelsCell.module.css";
import { TableCell } from "./TableCell";

const LABEL_LEVEL = "Color level";
const LABEL_CONTRACT = "contrast to";

interface LabelsCellProps {
  onMouseEnter: () => void;
}

export function LabelsCell({ onMouseEnter }: LabelsCellProps) {
  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        <div className={styles.label}>{LABEL_LEVEL}</div>

        <div className={styles.label}>
          <TextButton
            className={styles.button}
            mode="dark"
            text="APCA"
            onClick={() => {}}
          />
          <div className="flex items-center gap-1">{LABEL_CONTRACT}</div>
          <TextButton
            className={styles.button}
            mode="dark"
            text="Background"
            onClick={() => {}}
          />
        </div>

        <div className={styles.label}>
          <TextButton
            className={styles.button}
            mode="dark"
            text="Even chroma"
            onClick={() => {}}
          />
        </div>
      </div>
    </TableCell>
  );
}
