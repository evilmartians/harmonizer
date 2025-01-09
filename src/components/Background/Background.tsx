import classNames from "classnames";
import { parse } from "culori";
import { useEffect, useState } from "react";
import { useTableConfigContext } from "../../contexts/TableConfigContext";
import { useBackground } from "../../hooks/useBackground";
import { TextControl } from "../TextControl/TextControl";
import styles from "./Background.module.css";

const HINT_COLOR = "OKLCH, Hex, RGB, HSL…";
const ERROR_INVALID_COLOR =
  "This is not a valid color. Try OKLCH, Hex, RGB, or HSL";

export function Background() {
  const { width, startDrag } = useBackground();
  const { settings, updateBgColorDark, updateBgColorLight } =
    useTableConfigContext();
  const [knobIsHovered, setKnobIsHovered] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--dark-bg", settings.bgColorDark);
    root.style.setProperty("--light-bg", settings.bgColorLight);
  }, [settings.bgColorDark, settings.bgColorLight]);

  function validateColor(val: string): string | null {
    return parse(val) === undefined ? ERROR_INVALID_COLOR : null;
  }
  console.log("knobIsHovered", knobIsHovered);
  return (
    <div className={styles.container}>
      <div className={styles.controlContainer}>
        <div
          className={styles.dragKnob}
          style={{ left: `${width - 16}px` }}
          onMouseEnter={() => setKnobIsHovered(true)}
          onMouseLeave={() => setKnobIsHovered(false)}
          onMouseDown={startDrag}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Drag to resize</title>
            <path d="M7 3H5V5H7V3Z" fill="currentColor" />
            <path d="M11 3H9V5H11V3Z" fill="currentColor" />
            <path d="M5 7H7V9H5V7Z" fill="currentColor" />
            <path d="M7 11H5V13H7V11Z" fill="currentColor" />
            <path d="M9 7H11V9H9V7Z" fill="currentColor" />
            <path d="M11 11H9V13H11V11Z" fill="currentColor" />
          </svg>
        </div>
        <div className={styles.inputContainer}>
          <span className={classNames(styles.inputLabel, styles.dark)}>
            Dark mode background
          </span>
          <TextControl
            className={classNames(styles.input, styles.dark)}
            align="left"
            kind="ghost"
            fitContent
            value={settings.bgColorDark}
            title={HINT_COLOR}
            validator={validateColor}
            onValidEdit={updateBgColorDark}
          />
        </div>
        <div className={styles.inputContainer} style={{ left: width }}>
          <span className={classNames(styles.inputLabel, styles.light)}>
            Light mode background
          </span>
          <TextControl
            className={classNames(styles.input, styles.light)}
            align="left"
            kind="ghost"
            fitContent
            value={settings.bgColorLight}
            title={HINT_COLOR}
            validator={validateColor}
            onValidEdit={updateBgColorLight}
          />
        </div>
      </div>
      <div
        className={classNames(
          styles.darkLayer,
          knobIsHovered &&
            "shadow-[-1px_0_0_0_rgb(34,197,94)_inset,1px_0_0_0_rgb(34,197,94)]",
        )}
        style={{ width }}
      />
    </div>
  );
}
