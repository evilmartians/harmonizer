import type { CSSProperties } from "react";

export function getResolvedCssCustomProperty(
  element: HTMLElement,
  property: `--${string}`,
  relevantCssProperty: Exclude<keyof CSSProperties, number>,
): string {
  // It returns unresolved value, like `calc(var(--space) * N)`
  const value = getComputedStyle(element).getPropertyValue(property);
  const temp = document.createElement("div");
  document.body.appendChild(temp);
  temp.style.setProperty(relevantCssProperty, value);
  const resolvedValue = getComputedStyle(temp).getPropertyValue(relevantCssProperty);
  temp.remove();

  return resolvedValue;
}
