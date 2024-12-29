import styles from "./Background.module.css";

interface BackgroundProps {
  width: number;
  onResize: VoidFunction;
}

export function Background({ width, onResize }: BackgroundProps) {
  return (
    <div className={styles.container} style={{ width }}>
      <div className={styles.handle} onMouseDown={onResize} />
    </div>
  );
}
