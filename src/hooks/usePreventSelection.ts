import { useEffect } from "react";

export function usePreventSelection(isActive: boolean) {
  useEffect(() => {
    if (isActive) {
      document.body.style.userSelect = "none";
      return () => {
        document.body.style.userSelect = "";
      };
    }
  }, [isActive]);
}
