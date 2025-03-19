export function debounceRaf<P extends unknown[]>(fn: (...args: P) => void) {
  let rafId: number | null = null;

  return (...args: P) => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      rafId = null;
      fn(...args);
    });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  };
}
