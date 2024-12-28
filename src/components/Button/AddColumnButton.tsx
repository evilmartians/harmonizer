import plusIcon from "../../assets/icons/Plus.svg";
import styles from "./AddColumnButton.module.css";

interface AddColumnButtonProps {
  className?: string;
  title: string;
  onClick: () => void;
}

export function AddColumnButton({
  onClick,
  title,
  className = "",
}: AddColumnButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className}`}
      title={title}
    >
      <img src={plusIcon} alt="Add" width={24} height={24} />
    </button>
  );
}
