import { type CSSProperties, memo, useCallback, useRef } from "react";

import { useSignal, useSubscribe } from "@spred/react";
import clsx from "clsx";

import { Button } from "@core/components/Button/Button";
import { MPlus } from "@core/components/Icon/MPlus";
import { withAutosize } from "@core/components/Input/enhancers/withAutosize";
import { withNumericIncrementControls } from "@core/components/Input/enhancers/withNumericIncrementControls";
import { withValidation } from "@core/components/Input/enhancers/withValidation";
import { Input } from "@core/components/Input/Input";
import { useAppEvent } from "@core/hooks/useFocusRefOnEvent";
import {
  CHROMA_MAX,
  CHROMA_MIN,
  CONTRAST_MIN,
  getContrastMaxLevel,
  getContrastStep,
} from "@core/schemas/color";
import {
  $levelIds,
  copyChromaCapToAllLevels,
  getLevel,
  insertLevel,
  startChromaCopyPreview,
  stopChromaCopyPreview,
  updateLevelchromaCap,
  updateLevelContrast,
  updateLevelName,
} from "@core/stores/colors";
import { useLevelBgColorType, useLevelBgColorVariable, useLevelBgMode } from "@core/stores/hooks";
import {
  $bgRightStart,
  chromaModeStore,
  contrastModelStore,
  directionModeStore,
} from "@core/stores/settings";
import type { LevelId } from "@core/types";
import { formatOklch } from "@core/utils/colors/formatOklch";
import type { AnyProps } from "@core/utils/react/types";

import { DATA_ATTR_CELL_LEVEL_ID } from "./constants";
import { GridCell } from "./GridCell";
import styles from "./GridCellLevelHeader.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type LevelComponentProps<P extends AnyProps = {}> = { levelId: LevelId } & P;

const LABEL_NAME = "Level name";
const LABEL_CHROMA_CAP_SET = "Set cap";
const LABEL_CHROMA_CAP_DEFINED = "Cap";
const LABEL_CHROMA = "Level chroma";
const PLACEHOLDER_LEVEL = "Level";
const PLACEHOLDER_CONTRAST = "CR";

const HINT_LEVEL = "Color level name";
const HINT_FG_TO_BG_CONTRAST = "Contrast of text color to the background";
const HINT_BG_TO_FG_CONTRAST = "Contrast of background color to the text";
const HINT_CHROMA = "Chroma of all colors in this column";

const InsertBeforeArea = memo(function InsertBeforeArea({ levelId }: LevelComponentProps) {
  const name = useSubscribe(getLevel(levelId).name.$raw);
  const $isOnBgEdge = useSignal((get) => {
    const levelIds = get($levelIds);
    const bgRightStart = get($bgRightStart);
    return levelIds[bgRightStart] === levelId && bgRightStart > 0;
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
      onChange={(e) => updateLevelName(levelId, e.target.value)}
    />
  );
});

const LevelContrastInput = withValidation(withNumericIncrementControls(Input));
const ContrastInput = memo(function ContrastInput({ levelId }: LevelComponentProps) {
  const level = getLevel(levelId);
  const bgColorVariable = useLevelBgColorVariable(levelId);
  const contrast = useSubscribe(level.contrast.$raw);
  const error = useSubscribe(level.contrast.$validationError);
  const contrastModel = useSubscribe(contrastModelStore.$lastValidValue);

  const tintColor = useSubscribe(level.$tintColor);
  const directionMode = useSubscribe(directionModeStore.$lastValidValue);

  return (
    <LevelContrastInput
      id={`level-contrast-${levelId}`}
      size="xl"
      kind="bordered"
      customization={
        directionMode === "fgToBg"
          ? {
              "--input-color": tintColor.css,
              "--input-border-color": formatOklch(tintColor, 0.2),
            }
          : {
              "--input-color": bgColorVariable,
              "--input-border-color": tintColor.css,
              "--input-bg-color": tintColor.css,
            }
      }
      inputMode={contrastModel === "apca" ? "numeric" : "decimal"}
      min={CONTRAST_MIN}
      max={getContrastMaxLevel(contrastModel)}
      step={getContrastStep(contrastModel)}
      label={contrastModel.toUpperCase()}
      showLabel="always"
      placeholder={PLACEHOLDER_CONTRAST}
      value={contrast}
      title={directionMode === "fgToBg" ? HINT_FG_TO_BG_CONTRAST : HINT_BG_TO_FG_CONTRAST}
      error={error}
      onChange={(e) => updateLevelContrast(levelId, e.target.value)}
    />
  );
});

const CHROMA_INPUT_PRECISION = 3;
const LevelChromaInput = withValidation(withNumericIncrementControls(Input));
const ChromaInput = memo(function ChromaInput({ levelId }: LevelComponentProps) {
  const level = getLevel(levelId);
  const chroma = useSubscribe(level.chroma.$raw);
  const chromaCap = useSubscribe(level.chromaCap.$raw);
  const error = useSubscribe(level.chromaCap.$validationError);
  const $chromaPlaceholder = useSignal((get) => {
    return get(chromaModeStore.$lastValidValue) === "even"
      ? get(level.chroma.$lastValidValue).toFixed(CHROMA_INPUT_PRECISION)
      : "max";
  });
  const $chromaLabel = useSignal((get) => {
    const chromaCap = get(level.chromaCap.$raw);

    return chromaCap ? LABEL_CHROMA_CAP_DEFINED : LABEL_CHROMA_CAP_SET;
  });
  const chromaLabel = useSubscribe($chromaLabel);
  const chromaPlaceholder = useSubscribe($chromaPlaceholder);

  return (
    <div className={styles.chromaSection}>
      <LevelChromaInput
        id={`level-chroma-${levelId}`}
        className={styles.inputSecondary}
        size="m"
        kind="ghost"
        inputMode="decimal"
        style={
          {
            "--input-label-color": "var(--color-secondary)",
            "--input-label-fw": 400,
          } as CSSProperties
        }
        min={CHROMA_MIN}
        max={CHROMA_MAX}
        precision={CHROMA_INPUT_PRECISION}
        baseValue={chroma}
        step={0.001}
        label={chromaLabel}
        aria-label={LABEL_CHROMA}
        showLabel={chromaCap ? "always" : "hover"}
        placeholder={chromaPlaceholder}
        value={chromaCap ?? ""}
        title={HINT_CHROMA}
        error={error}
        onChange={(e) => updateLevelchromaCap(levelId, e.target.value || null)}
      />
      <Button
        size="xs"
        kind="ghost"
        className={styles.copyChromaButton}
        onClick={() => copyChromaCapToAllLevels(levelId)}
        onMouseEnter={() => startChromaCopyPreview(levelId)}
        onMouseLeave={stopChromaCopyPreview}
        title={
          chromaCap ? "Copy this cap to all other levels" : "Copy this chroma to all other levels"
        }
      >
        Apply
      </Button>
    </div>
  );
});

export const GridCellLevelHeader = memo(function GridCellLevelHeader({
  levelId,
}: LevelComponentProps) {
  const bgColorType = useLevelBgColorType(levelId);
  const bgMode = useLevelBgMode(levelId);

  return (
    <GridCell
      bgColorType={bgColorType}
      bgMode={bgMode}
      className={styles.cell}
      {...{ [DATA_ATTR_CELL_LEVEL_ID]: levelId }}
    >
      <InsertBeforeArea levelId={levelId} />
      <NameInput levelId={levelId} />
      <ContrastInput levelId={levelId} />
      <ChromaInput levelId={levelId} />
    </GridCell>
  );
});
