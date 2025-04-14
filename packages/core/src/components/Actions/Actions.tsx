import { BgMode } from "@core/components/BgMode/BgMode";
import { Button } from "@core/components/Button/Button";
import { useFileUploader } from "@core/components/FileInputButton/useFileUploader";
import { MArrowDownwards } from "@core/components/Icon/MArrowDownwards";
import { Menu } from "@core/components/Menu/Menu";
import { MenuItem } from "@core/components/Menu/MenuItem";
import { MenuItemGroup } from "@core/components/Menu/MenuItemGroup";
import { MenuItemSeparator } from "@core/components/Menu/MenuItemSeparator";
import { useDependencies } from "@core/DependenciesContext";
import { downloadConfigTarget, ExportTargets, uploadConfig } from "@core/stores/config";
import { $bgColorLightBgMode } from "@core/stores/settings";
import { ValidationError } from "@core/utils/errors/ValidationError";
import { objectEntries } from "@core/utils/object/objectEntries";
import { useSubscribe } from "@spred/react";
import type { ChangeEvent } from "react";

import styles from "./Actions.module.css";

async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
  try {
    await uploadConfig(e.target.files?.[0]);
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(
      error instanceof ValidationError
        ? "Couldn't parse file. It should be Harmonizer config"
        : String(error),
    );
  } finally {
    e.target.value = "";
  }
}

function UploadConfigMenuAction() {
  const { fileInput, triggerUpload } = useFileUploader({
    accept: ".json",
    onFilesChange: handleFileUpload,
  });
  return (
    <MenuItem value="upload-harmonizer-config" onClick={triggerUpload}>
      {fileInput}
      Upload Harmonizer config
    </MenuItem>
  );
}

export function Actions() {
  const { actions } = useDependencies();
  const bgMode = useSubscribe($bgColorLightBgMode);

  return (
    <BgMode bgMode={bgMode} className={styles.container}>
      {actions}
      <Menu
        renderTrigger={(triggerProps, indicatorProps) => (
          <Button
            size="m"
            kind="floating"
            {...triggerProps}
            {...indicatorProps}
            icon={<MArrowDownwards {...indicatorProps} />}
            aria-label="Download or upload configurations"
          />
        )}
      >
        <MenuItemGroup id="menu-group-export" label="Download">
          {objectEntries(ExportTargets).map(([exportTarget, config]) => (
            <MenuItem
              key={exportTarget}
              value={exportTarget}
              onClick={() => downloadConfigTarget(exportTarget)}
            >
              {config.name}
            </MenuItem>
          ))}
        </MenuItemGroup>
        <MenuItemSeparator />
        <UploadConfigMenuAction />
      </Menu>
    </BgMode>
  );
}
