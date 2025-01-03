import classNames from "classnames";
import { useTableConfigContext } from "../../contexts/TableConfigContext";
import { useBackground } from "../../hooks/useBackground";
import { TextControl } from "../TextControl/TextControl";
import styles from "./Background.module.css";
import { useEffect } from "react";
import { parse } from "culori";

export function Background() {
  const { width, startDrag } = useBackground();
  const { settings, updateBgColorDark, updateBgColorLight } =
    useTableConfigContext();

  useEffect(() => {
    const root = document.documentElement;

    // Update the CSS variables
    root.style.setProperty("--dark-bg", settings.bgColorDark);
    root.style.setProperty("--light-bg", settings.bgColorLight);
  }, [settings.bgColorDark, settings.bgColorLight]);

  const handleTextInput = (val: string, light: boolean) => {
    // First, validate that entred value is a valid color
    if (parse(val)) {
      if (light) {
        updateBgColorLight(val);
      } else {
        updateBgColorDark(val);
      }
    }
  };

  return (
    <div className={styles.container} style={{ width }}>
      <div className={styles.handle} onMouseDown={startDrag} />
      <div className={styles.inputContainer}>
        <span className={classNames(styles.inputLabel, styles.dark)}>
          Dark mode background
        </span>
        <TextControl
          className={classNames(styles.input, styles.dark)}
          align="left"
          kind="ghost"
          fitContent
          defaultValue={settings.bgColorDark}
          onChange={(e) => handleTextInput(e.target.value, false)}
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
          defaultValue={settings.bgColorLight}
          onChange={(e) => handleTextInput(e.target.value, true)}
        />
      </div>
    </div>
  );
}
