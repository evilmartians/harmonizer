import { TableCell } from "./TableCell";
import { TextButton } from "../Button/TextButton";
import styles from "./LabelsCell.module.css";

interface LabelsCellProps {
  onMouseEnter: () => void;
}

export function LabelsCell({ onMouseEnter }: LabelsCellProps) {
  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        <div className={styles.label}>Level</div>

        <div className={styles.label}>
          contrast
          <div className="flex items-center gap-1">
            <TextButton
              className={styles.button}
              text="APCA"
              onClick={() => {}}
            />
            to
          </div>
          <TextButton
            className={styles.button}
            text="Background"
            onClick={() => {}}
          />
        </div>

        <div className={styles.label}>
          <TextButton
            className={styles.button}
            text="Even chroma"
            onClick={() => {}}
          />
        </div>
      </div>
    </TableCell>
  );
}
