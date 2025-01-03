import classNames from "classnames";
import styles from "./AddRowButton.module.css";

interface AddRowButtonProps {
  className?: string;
  mode: "light" | "dark";
  title: string;
  onClick: () => void;
}

export function AddRowButton({
  onClick,
  mode,
  title,
  className = "",
}: AddRowButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(className, styles.button, styles[`mode_${mode}`])}
      title={title}
    >
      {/* TODO: replace with Icon componen. But how? */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.4 6H12.6V11.4H18V12.6H12.6V18H11.4V12.6H6V11.4H11.4V6Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20.8 12C20.8 16.8601 16.8601 20.8 12 20.8C7.13989 20.8 3.2 16.8601 3.2 12C3.2 7.13989 7.13989 3.2 12 3.2C16.8601 3.2 20.8 7.13989 20.8 12Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
