import classNames from "classnames";
import styles from "./TextButton.module.css";

interface TextButtonProps {
  className?: string;
  text: string;
  onClick: () => void;
}

export function TextButton({ className, text, onClick }: TextButtonProps) {
  return (
    <button onClick={onClick} className={classNames(className, styles.button)}>
      {text}
    </button>
  );
}
