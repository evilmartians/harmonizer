import { Button } from "@core/components/Button/Button";
import { MFourSquares } from "@core/components/Icon/MFourSquares";
import { getIndexedColors } from "@core/stores/colors";
import { $isExportConfigValid, getConfig } from "@core/stores/config";
import { useSubscribe } from "@spred/react";
import { pluginChannel } from "@ui/pluginChannel";

function upsertPalette() {
  pluginChannel.emit("palette:generate", {
    ...getConfig(),
    colors: getIndexedColors(),
  });
}

export type FigmaPluginActionsProps = { isUpdate?: boolean };

export function FigmaPluginActions({ isUpdate }: FigmaPluginActionsProps) {
  const isValid = useSubscribe($isExportConfigValid);

  return (
    <>
      <Button
        kind="floating"
        size="s"
        onClick={upsertPalette}
        iconStart={<MFourSquares />}
        disabled={!isValid}
      >
        {isUpdate ? "Update" : "Create"}
      </Button>
    </>
  );
}
