import styles from "./Background.module.css";
import { useBackground } from "../../hooks/useBackground";

export function Background() {
  const { width, startDrag } = useBackground();

  return (
    <div className={styles.container} style={{ width }}>
      <div className={styles.handle} onMouseDown={startDrag} />
    </div>
  );
}
