import classNames from "classnames";
import { useTableConfigContext } from "../../contexts/TableConfigContext";
import { useBackground } from "../../hooks/useBackground";
import { TextControl } from "../TextControl/TextControl";
import styles from "./Background.module.css";
import { useEffect } from "react";
import { parse } from "culori";

const HINT_COLOR = "OKLCH, Hex, RGB, HSL…";
const ERROR_INVALID_COLOR =
  "This is not a valid color. Try OKLCH, Hex, RGB, or HSL";

export function Background() {
  const { width, startDrag } = useBackground();
  const { settings, updateBgColorDark, updateBgColorLight } =
    useTableConfigContext();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--dark-bg", settings.bgColorDark);
    root.style.setProperty("--light-bg", settings.bgColorLight);
  }, [settings.bgColorDark, settings.bgColorLight]);

  function validateColor(val: string): string | null {
    return parse(val) === undefined ? ERROR_INVALID_COLOR : null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.darkLayer} style={{ width }}></div>
      <div
        className={styles.handle}
        style={{ left: `${width - 1}px` }}
        onMouseDown={startDrag}
      />
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
  );
}
