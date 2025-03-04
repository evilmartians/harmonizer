import { signal } from "@spred/core";

export const $hoveredColumn = signal<null | number>(null);

export function setHoveredColumn(index: number | null) {
  $hoveredColumn.set(index);
}

export function resetHoveredColumn() {
  $hoveredColumn.set(null);
}
