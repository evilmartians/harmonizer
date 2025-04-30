export function handleDragScrollByMiddleClick(container: HTMLElement) {
  const initialCursor = getComputedStyle(container).cursor;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let scrollLeft = 0;
  let scrollTop = 0;
  let activePointerId: number | null = null;

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 1) {
      return;
    }

    e.preventDefault();

    isDragging = true;
    activePointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    scrollLeft = container.scrollLeft;
    scrollTop = container.scrollTop;
    container.setPointerCapture(e.pointerId);
    container.style.cursor = "grabbing";
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) {
      return;
    }

    e.preventDefault();

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    container.scrollLeft = scrollLeft - dx;
    container.scrollTop = scrollTop - dy;
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.button !== 1 || !isDragging) {
      return;
    }

    isDragging = false;
    activePointerId = null;
    container.style.cursor = initialCursor;
    container.releasePointerCapture(e.pointerId);
  }

  function handlePointerLeave(e: PointerEvent) {
    if (isDragging && activePointerId === e.pointerId) {
      isDragging = false;
      activePointerId = null;
      container.style.cursor = initialCursor;
      container.releasePointerCapture(e.pointerId);
    }
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function handleAuxClick(e: MouseEvent) {
    if (e.button === 1) {
      e.preventDefault();
    }
  }

  container.addEventListener("pointerdown", handlePointerDown);
  container.addEventListener("pointermove", handlePointerMove);
  container.addEventListener("pointerup", handlePointerUp, { passive: true });
  container.addEventListener("pointerleave", handlePointerLeave);
  container.addEventListener("auxclick", handleAuxClick);

  return () => {
    container.removeEventListener("pointerdown", handlePointerDown);
    container.removeEventListener("pointermove", handlePointerMove);
    container.removeEventListener("pointerup", handlePointerUp);
    container.removeEventListener("pointerleave", handlePointerLeave);
    container.removeEventListener("auxclick", handleAuxClick);
  };
}
