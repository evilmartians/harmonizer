import { useSubscribe } from "@spred/react";

import { Button } from "@core/components/Button/Button";
import { ExportImportMenu } from "@core/components/ExportImportMenu/ExportImportMenu";
import { ExportConfigsList } from "@core/components/ExportImportMenu/items/ExportConfigsList";
import { OpenInWebApp } from "@core/components/ExportImportMenu/items/OpenInWebApp";
import { PasteWebAppUrl } from "@core/components/ExportImportMenu/items/PasteWebAppUrl";
import { UploadConfig } from "@core/components/ExportImportMenu/items/UploadConfig";
import { GitHubLink } from "@core/components/GitHubLink/GitHubLink";
import { MFourSquares } from "@core/components/Icon/MFourSquares";
import { MenuItemGroup } from "@core/components/Menu/MenuItemGroup";
import { MenuItemSeparator } from "@core/components/Menu/MenuItemSeparator";
import { Tooltip } from "@core/components/Tooltip/Tooltip";
import { $isExportConfigValid, getExportConfigWithColors } from "@core/stores/config";
import { mergeProps } from "@core/utils/react/mergeProps";
import { pluginChannel } from "@ui/pluginChannel";

function upsertPalette() {
  pluginChannel.emit("palette:generate", getExportConfigWithColors());
}

export type FigmaPluginActionsProps = { hasPalette: boolean };

export function FigmaPluginActions({ hasPalette }: FigmaPluginActionsProps) {
  const isValid = useSubscribe($isExportConfigValid);

  return (
    <>
      <Tooltip
        content={`Fix invalid values to ${hasPalette ? "update" : "create"} the palette`}
        disabled={isValid}
        renderTrigger={(triggerProps) => (
          <Button
            {...mergeProps(triggerProps, { onClick: isValid ? upsertPalette : undefined })}
            kind="floating"
            size="m"
            iconStart={<MFourSquares />}
            aria-disabled={!isValid}
          >
            {hasPalette ? "Update palette" : "Create palette"}
          </Button>
        )}
      />
      <ExportImportMenu>
        <MenuItemGroup id="menu-group-upload" label="Import">
          <PasteWebAppUrl value="paste-url" />
          <UploadConfig />
        </MenuItemGroup>
        <MenuItemSeparator />
        <MenuItemGroup id="menu-group-export" label="Export">
          <OpenInWebApp />
          <ExportConfigsList />
        </MenuItemGroup>
      </ExportImportMenu>
      <GitHubLink />
    </>
  );
}
