import type { CSSProperties } from "react";

export function stringifyStyle(style: CSSProperties) {
  return Object.entries(style)
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
}

export function buildStyle(selectors: string[], styles: string | CSSProperties) {
  return `${selectors.join(",")} {${typeof styles === "string" ? styles : stringifyStyle(styles)}}`;
}
