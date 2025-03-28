import type { CSSProperties } from "react";

export function stringifyCssProperties(style: CSSProperties) {
  return Object.entries(style)
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
}
