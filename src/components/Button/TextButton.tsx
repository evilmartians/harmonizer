import classNames from "classnames";
import styles from "./TextButton.module.css";

interface TextButtonProps {
  className?: string;
  mode: "light" | "dark";
  text: string;
  onClick: () => void;
}

export function TextButton({
  className,
  mode,
  text,
  onClick,
}: TextButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(className, styles.button, styles[`mode_${mode}`])}
    >
      {text}
    </button>
  );
}
