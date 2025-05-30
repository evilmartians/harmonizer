import { memo, useCallback, useRef } from "react";

import { useSignal, useSubscribe } from "@spred/react";
import clsx from "clsx";

import type { BgModeType } from "@core/components/BgMode/types";
import { Button } from "@core/components/Button/Button";
import { MPlus } from "@core/components/Icon/MPlus";
import { withAutosize } from "@core/components/Input/enhancers/withAutosize";
import { withNumericIncrementControls } from "@core/components/Input/enhancers/withNumericIncrementControls";
import { withValidation } from "@core/components/Input/enhancers/withValidation";
import { Input } from "@core/components/Input/Input";
import { useAppEvent } from "@core/hooks/useFocusRefOnEvent";
import { CONTRAST_MIN, getContrastMaxLevel, getContrastStep } from "@core/schemas/color";
import {
  $levelIds,
  getLevel,
  insertLevel,
  updateLevelChroma,
  updateLevelContrast,
  updateLevelName,
} from "@core/stores/colors";
import { useLevelBgMode } from "@core/stores/hooks";
import {
  $bgLightStart,
  bgColorDarkStore,
  bgColorLightStore,
  chromaModeStore,
  contrastModelStore,
  directionModeStore,
} from "@core/stores/settings";
import { LevelChroma, LevelContrast, LevelName, type LevelId } from "@core/types";
import { formatOklch } from "@core/utils/colors/formatOklch";
import type { AnyProps } from "@core/utils/react/types";

import { DATA_ATTR_CELL_LEVEL_ID } from "./constants";
import { GridCell } from "./GridCell";
import styles from "./GridCellLevelHeader.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type LevelComponentProps<P extends AnyProps = {}> = { levelId: LevelId } & P;

const LABEL_NAME = "Level name";
const LABEL_CHROMA = "Level chroma";
const PLACEHOLDER_LEVEL = "Level";
const PLACEHOLDER_CONTRAST = "CR";
const PLACEHOLDER_CHROMA = "Chroma";

const HINT_LEVEL = "Color level name";
const HINT_FG_TO_BG_CONTRAST = "Contrast of text color to the background";
const HINT_BG_TO_FG_CONTRAST = "Contrast of background color to the text";
const HINT_CHROMA = "Chroma of all colors in this column";

const InsertBeforeArea = memo(function InsertBeforeArea({ levelId }: LevelComponentProps) {
  const name = useSubscribe(getLevel(levelId).name.$raw);
  const $isOnBgEdge = useSignal((get) => {
    const levelIds = get($levelIds);
    const bgLightStart = get($bgLightStart);
    return levelIds[bgLightStart] === levelId && bgLightStart > 0;
  });
  const isOnBgEdge = useSubscribe($isOnBgEdge);
  const handleInsert = useCallback(() => insertLevel(levelId), [levelId]);

  return (
    <div className={styles.insertBeforeContainer}>
      <Button
        className={clsx(styles.insertBeforeButton, isOnBgEdge && styles.edgeIcon)}
        kind="ghost"
        rounded
        size="m"
        icon={<MPlus />}
        onClick={handleInsert}
        aria-label={`Insert new level column before column with name: ${name}`}
      />
    </div>
  );
});

const LevelNameInput = withValidation(withAutosize(Input));
const NameInput = memo(function NameInput({ levelId }: LevelComponentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const $name = getLevel(levelId).name;
  const name = useSubscribe($name.$raw);
  const error = useSubscribe($name.$validationError);

  useAppEvent("levelAdded", (id) => {
    if (id === levelId) {
      inputRef.current?.focus();
    }
  });

  return (
    <LevelNameInput
      ref={inputRef}
      id={`level-name-${levelId}`}
      className={styles.inputSecondary}
      size="m"
      kind="ghost"
      label={LABEL_NAME}
      placeholder={PLACEHOLDER_LEVEL}
      value={name}
      title={HINT_LEVEL}
      error={error}
      onChange={(e) => updateLevelName(levelId, LevelName(e.target.value))}
    />
  );
});

const LevelContrastInput = withValidation(withNumericIncrementControls(Input));
const ContrastInput = memo(function ContrastInput({
  levelId,
  bgMode,
}: LevelComponentProps<{ bgMode: BgModeType }>) {
  const level = getLevel(levelId);
  const bgColorLight = useSubscribe(bgColorLightStore.$raw);
  const bgColorDark = useSubscribe(bgColorDarkStore.$raw);
  const contrast = useSubscribe(level.contrast.$raw);
  const error = useSubscribe(level.contrast.$validationError);
  const contrastModel = useSubscribe(contrastModelStore.$lastValidValue);

  const tintColor = useSubscribe(level.$tintColor);
  const directionMode = useSubscribe(directionModeStore.$lastValidValue);
  const currentBgColor = bgMode === "dark" ? bgColorDark : bgColorLight;

  return (
    <LevelContrastInput
      id={`level-contrast-${levelId}`}
      className={styles.inputPrimary}
      size="xl"
      kind="bordered"
      customization={
        directionMode === "fgToBg"
          ? {
              "--input-color": tintColor.css,
              "--input-border-color": formatOklch(tintColor, 0.2),
            }
          : {
              "--input-color": currentBgColor,
              "--input-border-color": tintColor.css,
              "--input-bg-color": tintColor.css,
            }
      }
      min={CONTRAST_MIN}
      max={getContrastMaxLevel(contrastModel)}
      step={getContrastStep(contrastModel)}
      label={contrastModel.toUpperCase()}
      placeholder={PLACEHOLDER_CONTRAST}
      value={contrast}
      title={directionMode === "fgToBg" ? HINT_FG_TO_BG_CONTRAST : HINT_BG_TO_FG_CONTRAST}
      error={error}
      onChange={(e) => {
        let newValue = Number.parseFloat(e.target.value);
        if (Number.isNaN(newValue)) {
          newValue = 0;
        }
        updateLevelContrast(levelId, LevelContrast(newValue));
      }}
    />
  );
});

const LevelChromaInput = withValidation(withNumericIncrementControls(withAutosize(Input)));
const ChromaInput = memo(function ChromaInput({ levelId }: LevelComponentProps) {
  const level = getLevel(levelId);
  const $chroma = useSignal((get) => {
    return get(chromaModeStore.$lastValidValue) === "even"
      ? get(level.$tintColor).referencedC.toFixed(2)
      : "max";
  });
  const chroma = useSubscribe($chroma);
  const error = useSubscribe(level.chroma.$validationError);

  return (
    <LevelChromaInput
      id={`level-chroma-${levelId}`}
      className={styles.inputSecondary}
      size="m"
      kind="ghost"
      label={LABEL_CHROMA}
      placeholder={PLACEHOLDER_CHROMA}
      inputMode="decimal"
      value={chroma}
      title={HINT_CHROMA}
      error={error}
      disabled
      onChange={(e) => {
        let newValue = Number.parseFloat(e.target.value);
        if (Number.isNaN(newValue)) {
          newValue = 0;
        }
        updateLevelChroma(levelId, LevelChroma(newValue));
      }}
    />
  );
});

export const GridCellLevelHeader = memo(function GridCellLevelHeader({
  levelId,
}: LevelComponentProps) {
  const bgMode = useLevelBgMode(levelId);

  return (
    <GridCell bgMode={bgMode} className={styles.cell} {...{ [DATA_ATTR_CELL_LEVEL_ID]: levelId }}>
      <InsertBeforeArea levelId={levelId} />
      <NameInput levelId={levelId} />
      <ContrastInput levelId={levelId} bgMode={bgMode} />
      <ChromaInput levelId={levelId} />
    </GridCell>
  );
});
