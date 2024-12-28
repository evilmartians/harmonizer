import binIcon from "../../assets/icons/Bin.svg";
import styles from "./RemoveButton.module.css";

interface RemoveButtonProps {
  className?: string;
  title: string;
  onClick: () => void;
}

export function RemoveButton({
  onClick,
  title,
  className = "",
}: RemoveButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className}`}
      title={title}
    >
      <img src={binIcon} alt="Remove" width={16} height={16} />
    </button>
  );
}
