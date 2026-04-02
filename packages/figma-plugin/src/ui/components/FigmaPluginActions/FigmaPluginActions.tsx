import { useSubscribe } from "@spred/react";
import { pluginChannel } from "@ui/pluginChannel";

import { Button } from "@core/components/Button/Button";
import { GitHubLink } from "@core/components/GitHubLink/GitHubLink";
import { ExportImportMenu } from "@core/components/ExportImportMenu/ExportImportMenu";
import { ExportConfigsList } from "@core/components/ExportImportMenu/items/ExportConfigsList";
import { OpenInWebApp } from "@core/components/ExportImportMenu/items/OpenInWebApp";
import { PasteWebAppUrl } from "@core/components/ExportImportMenu/items/PasteWebAppUrl";
import { UploadConfig } from "@core/components/ExportImportMenu/items/UploadConfig";
import { MFourSquares } from "@core/components/Icon/MFourSquares";
import { MenuItemGroup } from "@core/components/Menu/MenuItemGroup";
import { MenuItemSeparator } from "@core/components/Menu/MenuItemSeparator";
import { $isExportConfigValid, getExportConfigWithColors } from "@core/stores/config";

function upsertPalette() {
  pluginChannel.emit("palette:generate", getExportConfigWithColors());
}

export type FigmaPluginActionsProps = { hasPalette: boolean };

export function FigmaPluginActions({ hasPalette }: FigmaPluginActionsProps) {
  const isValid = useSubscribe($isExportConfigValid);

  return (
    <>
      <Button
        kind="floating"
        size="m"
        onClick={upsertPalette}
        iconStart={<MFourSquares />}
        disabled={!isValid}
      >
        {hasPalette ? "Update palette" : "Create palette"}
      </Button>
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
