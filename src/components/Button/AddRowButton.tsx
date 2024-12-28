import plusIcon from "../../assets/icons/Plus.svg";
import styles from "./AddRowButton.module.css";

interface AddRowButtonProps {
  className?: string;
  title: string;
  onClick: () => void;
}

export function AddRowButton({
  onClick,
  title,
  className = "",
}: AddRowButtonProps) {
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
