import { Button } from "@core/components/Button/Button";
import { getIndexedColors } from "@core/stores/colors";
import { getConfig } from "@core/stores/config";
import { pluginChannel } from "@ui/pluginChannel";

function upsertPalette() {
  pluginChannel.emit("palette:generate", {
    ...getConfig(),
    colors: getIndexedColors(),
  });
}

export type FigmaPluginActionsProps = { isUpdate?: boolean };

export function FigmaPluginActions({ isUpdate }: FigmaPluginActionsProps) {
  return (
    <>
      <Button kind="primary" size="s" onClick={upsertPalette}>
        {isUpdate ? "Update" : "Create"}
      </Button>
    </>
  );
}
