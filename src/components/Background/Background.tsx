import { useBackground } from "../../hooks/useBackground";
import styles from "./Background.module.css";

export function Background() {
  const { width, startDrag } = useBackground();
  return (
    <div className={styles.container} style={{ width }}>
      <div className={styles.handle} onMouseDown={startDrag} />
    </div>
  );
}
