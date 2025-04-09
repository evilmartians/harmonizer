import { useId, useMemo } from "react";

export function useIdWithFallback(id: string | null | undefined) {
  const deterministicId = useId();

  return useMemo(() => id ?? deterministicId, [id, deterministicId]);
}
