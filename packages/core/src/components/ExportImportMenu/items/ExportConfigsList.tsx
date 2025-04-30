import { MenuItemButton } from "@core/components/Menu/MenuItemButton";
import { downloadConfigTarget, ExportTargets } from "@core/stores/config";
import { objectEntries } from "@core/utils/object/objectEntries";

export function ExportConfigsList() {
  return objectEntries(ExportTargets).map(([exportTarget, config]) => (
    <MenuItemButton
      key={exportTarget}
      value={exportTarget}
      onClick={() => downloadConfigTarget(exportTarget)}
    >
      {config.name}
    </MenuItemButton>
  ));
}
