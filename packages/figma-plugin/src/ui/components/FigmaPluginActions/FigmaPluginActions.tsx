import { Button } from "@core/components/Button/Button";
import { MFourSquares } from "@core/components/Icon/MFourSquares";
import { $isExportConfigValid, getExportConfigWithColors } from "@core/stores/config";
import { useSubscribe } from "@spred/react";
import { pluginChannel } from "@ui/pluginChannel";

function upsertPalette() {
  pluginChannel.emit("palette:generate", getExportConfigWithColors());
}

export type FigmaPluginActionsProps = { isUpdate?: boolean };

export function FigmaPluginActions({ isUpdate }: FigmaPluginActionsProps) {
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
        {isUpdate ? "Update palette" : "Create palette"}
      </Button>
    </>
  );
}
