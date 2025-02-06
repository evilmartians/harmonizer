import type React from "react";

import styles from "./IconTextButton.module.css";

type IconTextButtonProps = {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
};

export function IconTextButton({ icon, text, onClick }: IconTextButtonProps) {
  return (
    <button type="button" onClick={onClick} className={styles.button}>
      {icon}
      <span className={styles.text}>{text}</span>
    </button>
  );
}
