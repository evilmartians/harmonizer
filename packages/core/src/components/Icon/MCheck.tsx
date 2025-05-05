import type { SVGProps } from "react";

export type MCheckProps = SVGProps<SVGSVGElement>;

export function MCheck(props: MCheckProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path stroke="currentColor" fill="none" d="M3 8.385 7.286 13 13 3" />
    </svg>
  );
}
