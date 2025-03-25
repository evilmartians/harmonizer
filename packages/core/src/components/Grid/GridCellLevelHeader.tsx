import type { BgModeType } from "@core/components/BgMode/types";
import { Button } from "@core/components/Button/Button";
import { MPlus } from "@core/components/Icon/MPlus";
import { withAutosize } from "@core/components/Input/enhancers/withAutosize";
import { withNumericIncrementControls } from "@core/components/Input/enhancers/withNumericIncrementControls";
import { withValidation } from "@core/components/Input/enhancers/withValidation";
import { Input } from "@core/components/Input/Input";
import {
  apcaContrastLevelSchema,
  chromaLevelSchema,
  wcagContrastLevelSchema,
} from "@core/schemas/color";
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
  $bgColorDark,
  $bgColorLight,
  $bgLightStart,
  $chromaMode,
  $contrastModel,
  $directionMode,
} from "@core/stores/settings";
import { ChromaLevel, ContrastLevel, type LevelIndex, LevelName, type LevelId } from "@core/types";
import { formatOklch } from "@core/utils/colors/formatOklch";
import type { AnyProps } from "@core/utils/react/types";
import { getInputNumberValidator } from "@core/utils/schema/getInputValidator";
import { useSignal, useSubscribe } from "@spred/react";
import clsx from "clsx";
import { memo, useCallback, useMemo } from "react";

import { DATA_ATTR_CELL_LEVEL_ID } from "./constants";
import { GridCell } from "./GridCell";
import styles from "./GridCellLevelHeader.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type LevelComponentProps<P extends AnyProps = {}> = { levelId: LevelId } & P;

const PLACEHOLDER_LEVEL = "Level";
const PLACEHOLDER_CONTRAST = "CR";
const PLACEHOLDER_CHROMA = "Chroma";

const HINT_LEVEL = "Color level name";
const HINT_CONTRAST = "Contrast between color and background";
const HINT_CHROMA = "Chroma of all colors in this column";

const InsertBeforeArea = memo(function InsertBeforeArea({ levelId }: LevelComponentProps) {
  const name = useSubscribe(getLevel(levelId).$name);
  const $isOnBgEdge = useSignal((get) => {
    const levelIds = get($levelIds);
    const bgLightStart = get($bgLightStart);
    return levelIds[bgLightStart] === levelId;
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

const LevelNameInput = withAutosize(Input);
const NameInput = memo(function NameInput({ levelId }: LevelComponentProps) {
  const name = useSubscribe(getLevel(levelId).$name);

  return (
    <LevelNameInput
      className={styles.inputSecondary}
      size="m"
      kind="ghost"
      placeholder={PLACEHOLDER_LEVEL}
      value={name}
      title={HINT_LEVEL}
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
  const bgColorLight = useSubscribe($bgColorLight);
  const bgColorDark = useSubscribe($bgColorDark);
  const contrast = useSubscribe(level.$contrast);
  const contrastModel = useSubscribe($contrastModel);
  const levelContrastInputSchema = useMemo(
    () =>
      getInputNumberValidator(
        contrastModel === "apca" ? apcaContrastLevelSchema : wcagContrastLevelSchema,
      ),
    [contrastModel],
  );
  const tintColor = useSubscribe(level.$tintColor);
  const directionMode = useSubscribe($directionMode);
  const currentBgColor = bgMode === "dark" ? bgColorDark : bgColorLight;

  return (
    <LevelContrastInput
      className={styles.inputPrimary}
      size="xl"
      label={contrastModel.toUpperCase()}
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
      incrementStep={contrastModel === "apca" ? 1 : 0.1}
      placeholder={PLACEHOLDER_CONTRAST}
      value={contrast}
      title={HINT_CONTRAST}
      schema={levelContrastInputSchema}
      onChange={(e) =>
        updateLevelContrast(levelId, ContrastLevel(Number.parseFloat(e.target.value)))
      }
    />
  );
});

const LevelChromaInput = withValidation(withNumericIncrementControls(withAutosize(Input)));
const levelChromaInputSchema = getInputNumberValidator(chromaLevelSchema);
const ChromaInput = memo(function ChromaInput({ levelId }: LevelComponentProps) {
  const level = getLevel(levelId);
  const $chroma = useSignal((get) => {
    return get($chromaMode) === "even" ? get(level.$tintColor).referencedC.toFixed(2) : "max";
  });
  const chroma = useSubscribe($chroma);

  return (
    <LevelChromaInput
      className={styles.inputSecondary}
      size="m"
      kind="ghost"
      placeholder={PLACEHOLDER_CHROMA}
      inputMode="decimal"
      value={chroma}
      title={HINT_CHROMA}
      schema={levelChromaInputSchema}
      disabled
      onChange={(e) => updateLevelChroma(levelId, ChromaLevel(Number.parseFloat(e.target.value)))}
    />
  );
});

export const GridCellLevelHeader = memo(function GridCellLevelHeader({
  levelId,
  levelIndex,
}: LevelComponentProps<{ levelIndex: LevelIndex }>) {
  const bgMode = useLevelBgMode(levelIndex);

  return (
    <GridCell bgMode={bgMode} className={styles.cell} {...{ [DATA_ATTR_CELL_LEVEL_ID]: levelId }}>
      <InsertBeforeArea levelId={levelId} />
      <NameInput levelId={levelId} />
      <ContrastInput levelId={levelId} bgMode={bgMode} />
      <ChromaInput levelId={levelId} />
    </GridCell>
  );
});
