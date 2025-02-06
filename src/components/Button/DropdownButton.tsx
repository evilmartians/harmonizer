import classNames from "classnames";

import styles from "./DropdownButton.module.css";

type DropdownOption = {
  value: string;
  label: string;
};

type DropdownButtonProps = {
  className?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
};

export function DropdownButton({ className, options, value, onChange }: DropdownButtonProps) {
  return (
    <div className={classNames(styles.button, className)}>
      <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
