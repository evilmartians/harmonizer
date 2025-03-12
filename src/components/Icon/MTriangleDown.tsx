import type { SVGProps } from "react";

export type MTriangleDownProps = SVGProps<SVGSVGElement>;

export function MTriangleDown(props: MTriangleDownProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path fill="currentColor" d="M10.5 6h-5L8 10.5 10.5 6Z" />
    </svg>
  );
}
