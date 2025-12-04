import { memo } from "react";

import { useSubscribe } from "@spred/react";
import clsx from "clsx";

import { Button } from "@core/components/Button/Button";
import { Menu } from "@core/components/Menu/Menu";
import { MenuItemButton } from "@core/components/Menu/MenuItemButton";
import { MenuItemSeparator } from "@core/components/Menu/MenuItemSeparator";
import { Text } from "@core/components/Text/Text";
import { ChromaMode } from "@core/schemas/brand";
import { $isAnyChromaCapSet, resetAllChroma } from "@core/stores/colors";
import {
  chromaModeStore,
  colorSpaceStore,
  contrastModelStore,
  directionModeStore,
  $isColorSpaceLocked,
  toggleColorSpace,
  toggleContrastModel,
  toggleDirectionMode,
  updateChromaMode,
  $bgColorModeLeft,
} from "@core/stores/settings";

import { GridCell } from "./GridCell";
import styles from "./GridLeftTopCell.module.css";

const LABEL_LEVEL = "Color level";
const LABEL_CONTRACT = "contrast to";
const LABEL_DIRECTION_MODE = {
  bgToFg: "text",
  fgToBg: "background",
};
const LABEL_CHROMA_MODE = "Chroma mode";
const CHROMA_OPTIONS = [
  { value: "even", label: "Even chroma" },
  { value: "max", label: "Max chroma" },
];
const HINT_LOCKED_COLOR_SPACE = "To change color profile, adjust it in the Figma file settings";

export const GridLeftTopCell = memo(function GridLeftTopCell() {
  const bgMode = useSubscribe($bgColorModeLeft);
  const contrastModel = useSubscribe(contrastModelStore.$lastValidValue);
  const directionMode = useSubscribe(directionModeStore.$lastValidValue);
  const chromaModeValue = useSubscribe(chromaModeStore.$lastValidValue);
  const colorSpace = useSubscribe(colorSpaceStore.$lastValidValue);
  const isColorSpaceLocked = useSubscribe($isColorSpaceLocked);
  const hasChromaCaps = useSubscribe($isAnyChromaCapSet);

  return (
    <GridCell bgColorType="left" bgMode={bgMode} className={styles.cell}>
      <Text size="s" kind="secondary" className={styles.levelLabel}>
        {LABEL_LEVEL}
      </Text>
      <div className={clsx(styles.container, styles.middle)}>
        <Button className={styles.contrastModelButton} size="xs" onClick={toggleContrastModel}>
          {contrastModel}
        </Button>
        {contrastModel === "apca" && (
          <>
            <Text size="s" kind="secondary">
              {LABEL_CONTRACT}
            </Text>
            <Button size="xs" onClick={toggleDirectionMode}>
              {LABEL_DIRECTION_MODE[directionMode as keyof typeof LABEL_DIRECTION_MODE]}
            </Button>
          </>
        )}
      </div>

      <div className={clsx(styles.container, styles.bottom)}>
        <div className={clsx(styles.container, styles.colorModePicker)}>
          <Button
            size="xs"
            onClick={toggleColorSpace}
            disabled={isColorSpaceLocked}
            title={isColorSpaceLocked ? HINT_LOCKED_COLOR_SPACE : undefined}
          >
            {colorSpace}
          </Button>
          <Text size="s" kind="secondary">
            colors
          </Text>
        </div>
        <Menu
          renderTrigger={(triggerProps) => (
            <Button size="xs" {...triggerProps} title={LABEL_CHROMA_MODE}>
              {CHROMA_OPTIONS.find((opt) => opt.value === chromaModeValue)?.label}
            </Button>
          )}
        >
          <>
            {CHROMA_OPTIONS.map((option) => (
              <MenuItemButton
                key={option.value}
                value={option.value}
                data-current={chromaModeValue === option.value ? "" : undefined}
                onClick={() => updateChromaMode(ChromaMode(option.value as "even" | "max"))}
              >
                {option.label}
              </MenuItemButton>
            ))}
            {hasChromaCaps && (
              <>
                <MenuItemSeparator />
                <MenuItemButton value="reset-chroma" onClick={resetAllChroma}>
                  Reset changes
                </MenuItemButton>
              </>
            )}
          </>
        </Menu>
      </div>
    </GridCell>
  );
});
