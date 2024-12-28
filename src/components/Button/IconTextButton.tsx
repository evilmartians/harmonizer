import React from 'react';
import styles from './IconTextButton.module.css';

interface IconTextButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

export function IconTextButton({ icon, text, onClick }: IconTextButtonProps) {
  return (
    <button
      onClick={onClick}
      className={styles.button}
    >
      {icon}
      <span className={styles.text}>{text}</span>
    </button>
  );
}