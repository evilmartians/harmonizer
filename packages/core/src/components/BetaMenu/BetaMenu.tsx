import { useSubscribe } from "@spred/react";

import { Button } from "@core/components/Button/Button";
import { MFlask } from "@core/components/Icon/MFlask";
import { MTriangleDown } from "@core/components/Icon/MTriangleDown";
import { Menu } from "@core/components/Menu/Menu";
import { MenuItemButton } from "@core/components/Menu/MenuItemButton";
import { MenuItemGroup } from "@core/components/Menu/MenuItemGroup";
import { MenuItemSeparator } from "@core/components/Menu/MenuItemSeparator";
import { levelStepsPresets } from "@core/levelStepsPresets";
import { LEVEL_STEPS_PRESETS, type LevelStepsPreset } from "@core/schemas/brand";
import { resetToInitialState } from "@core/stores/config";
import {
  applyLevelStepsPreset,
  distributeContrastEvenly,
  levelStepsPresetStore,
} from "@core/stores/settings";

import styles from "./BetaMenu.module.css";

export function BetaMenu() {
  const currentPreset = useSubscribe(levelStepsPresetStore.$lastValidValue);

  return (
    <Menu
      renderTrigger={(triggerProps) => (
        <Button
          size="m"
          kind="floating"
          {...triggerProps}
          aria-label="Beta features"
          className={styles.button}
        >
          <span className={styles.iconContainer}>
            <MFlask className={styles.flaskIcon} />
            <MTriangleDown className={styles.caretIcon} />
          </span>
        </Button>
      )}
    >
      <MenuItemGroup id="level-steps" label="Palette Range Steps">
        {LEVEL_STEPS_PRESETS.map((preset) => (
          <MenuItemButton
            key={preset}
            value={preset}
            data-current={currentPreset === preset ? "" : undefined}
            onClick={() => applyLevelStepsPreset(preset as LevelStepsPreset)}
          >
            {levelStepsPresets[preset].label}
          </MenuItemButton>
        ))}
      </MenuItemGroup>
      <MenuItemSeparator />
      <MenuItemButton value="distribute-contrast" onClick={() => distributeContrastEvenly()}>
        Distribute Contrast Evenly
      </MenuItemButton>
      <MenuItemSeparator />
      <MenuItemButton value="reset-initial" onClick={resetToInitialState}>
        Reset to Initial State
      </MenuItemButton>
    </Menu>
  );
}
