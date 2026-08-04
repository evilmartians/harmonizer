import { useCallback, useState } from "react";

import { useSubscribe } from "@spred/react";

import { Button } from "@core/components/Button/Button";
import { ExportImportMenu } from "@core/components/ExportImportMenu/ExportImportMenu";
import { ExportConfigsList } from "@core/components/ExportImportMenu/items/ExportConfigsList";
import { PasteWebAppUrl } from "@core/components/ExportImportMenu/items/PasteWebAppUrl";
import { UploadConfig } from "@core/components/ExportImportMenu/items/UploadConfig";
import { GitHubLink } from "@core/components/GitHubLink/GitHubLink";
import { MCheck } from "@core/components/Icon/MCheck";
import { MLink } from "@core/components/Icon/MLink";
import { MenuItemGroup } from "@core/components/Menu/MenuItemGroup";
import { MenuItemSeparator } from "@core/components/Menu/MenuItemSeparator";
import { Tooltip } from "@core/components/Tooltip/Tooltip";
import { $isExportConfigValid } from "@core/stores/config";
import { mergeProps } from "@core/utils/react/mergeProps";
import { trackEvent } from "@web-app/plausible";

const TIMEOUT = 2000;
export function CopyPermantentUrlButton() {
  const isValid = useSubscribe($isExportConfigValid);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const url = globalThis.location.href;
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), TIMEOUT);
  }, []);

  return (
    <Tooltip
      content="Fix invalid values to copy the link"
      disabled={isValid}
      renderTrigger={(triggerProps) => (
        <Button
          {...mergeProps(triggerProps, { onClick: isValid ? handleCopy : undefined })}
          kind="floating"
          size="m"
          icon={isCopied ? <MCheck /> : <MLink />}
          aria-label="Copy URL"
          aria-disabled={!isValid}
        />
      )}
    />
  );
}

export function WebAppActions() {
  return (
    <>
      <CopyPermantentUrlButton />
      <ExportImportMenu>
        <MenuItemGroup id="menu-group-upload" label="Import">
          <PasteWebAppUrl value="paste-url" onPaste={() => trackEvent("Imported: URL Pasted")} />
          <UploadConfig onClick={() => trackEvent("Imported: Config uploaded")} />
        </MenuItemGroup>
        <MenuItemSeparator />
        <MenuItemGroup id="menu-group-export" label="Export">
          <ExportConfigsList
            onClick={(exportTarget) => trackEvent("Exported", { props: { exportTarget } })}
          />
        </MenuItemGroup>
      </ExportImportMenu>
      <GitHubLink />
    </>
  );
}
