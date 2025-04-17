import { useCallback, useState } from "react";

import { Button } from "@core/components/Button/Button";
import { MCheck } from "@core/components/Icon/MCheck";
import { MCopy } from "@core/components/Icon/MCopy";

const TIMEOUT = 2000;
export function CopyUrlAction() {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const url = globalThis.location.href;
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), TIMEOUT);
  }, []);

  return (
    <Button
      kind="floating"
      size="m"
      icon={isCopied ? <MCheck /> : <MCopy />}
      aria-label="Copy URL"
      onClick={handleCopy}
    />
  );
}
