import { useSubscribe } from "@spred/react";
import clsx from "clsx";

import { TextControl } from "../TextControl/TextControl";

import styles from "./LevelCell.module.css";
import { TableCell } from "./TableCell";

import { getLevel, updateLevelChroma, updateLevelContrast, updateLevelName } from "@/stores/colors";
import { $chromaMode, $contrastModel } from "@/stores/settings";
import type { ChromaLevel, ContrastLevel, LevelId } from "@/types";

const PLACEHOLDER_LEVEL = "Level";
const PLACEHOLDER_CONTRAST = "CR";
const PLACEHOLDER_CHROMA = "Chroma";

const HINT_LEVEL = "Color level name";
const HINT_CONTRAST = "Contrast between color and background";
const HINT_CHROMA = "Chroma of all colors in this column";

const ERROR_INVALID_CONTRAST = "Contrast must be a number 0…108";
const ERROR_INVALID_CHROMA = "Chroma must be a number 0…0.37";

type LevelCellProps = {
  levelId: LevelId;
  mode: "light" | "dark";
  onMouseEnter: () => void;
};

function validateContrast(val: string): string | null {
  const regExp = /^[0-9]+$/;
  const number = Number.parseFloat(val);
  if (!regExp.test(val) || Number.isNaN(number) || number < 0 || number > 108) {
    return ERROR_INVALID_CONTRAST;
  }
  return null;
}

function validateChroma(val: string): string | null {
  const regExp = /^[0-9]+$/;
  const number = Number.parseFloat(val);

  if (!regExp.test(val) || Number.isNaN(number) || number < 0 || number > 0.37) {
    return ERROR_INVALID_CHROMA;
  }
  return null;
}

export function LevelCell({ levelId, mode, onMouseEnter }: LevelCellProps) {
  const level = getLevel(levelId);
  const name = useSubscribe(level.$name);
  const contrast = useSubscribe(level.$contrast);
  const contrastModel = useSubscribe($contrastModel);
  const tintColor = useSubscribe(level.$tintColor);
  const chromaMode = useSubscribe($chromaMode);
  const editableChroma = !chromaMode; // TODO: chromaMode === "custom";
  const chroma = chromaMode === "even" ? tintColor.referencedC.toFixed(2) : "max";

  return (
    <TableCell onMouseEnter={onMouseEnter}>
      <div className={styles.container}>
        <TextControl
          className={clsx(styles.inputSecondary, styles[`mode_${mode}`])}
          inputSize="m"
          kind="ghost"
          placeholder={PLACEHOLDER_LEVEL}
          value={name}
          title={HINT_LEVEL}
          onValidEdit={(value) => updateLevelName(levelId, value)}
        />
        <TextControl
          className={clsx(styles.inputPrimary, styles[`mode_${mode}`])}
          inputSize="l"
          kind="bordered"
          tintColor={tintColor}
          placeholder={PLACEHOLDER_CONTRAST}
          value={contrast}
          label={contrastModel}
          title={HINT_CONTRAST}
          validator={validateContrast}
          onValidEdit={
            (value) => updateLevelContrast(levelId, Number.parseFloat(value) as ContrastLevel) // TODO: check type
          }
        />
        <TextControl
          className={clsx(styles.inputSecondary, styles[`mode_${mode}`])}
          inputSize="m"
          kind="ghost"
          placeholder={PLACEHOLDER_CHROMA}
          value={chroma}
          title={HINT_CHROMA}
          disabled={!editableChroma}
          validator={validateChroma}
          onValidEdit={
            (value) => updateLevelChroma(levelId, Number.parseFloat(value) as ChromaLevel) // TODO: check type
          }
        />
      </div>
    </TableCell>
  );
}
