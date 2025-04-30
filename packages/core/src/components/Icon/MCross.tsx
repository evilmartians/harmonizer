import type { SVGProps } from "react";

export type MCrossProps = SVGProps<SVGSVGElement>;

export function MCross(props: MCrossProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        stroke="currentColor"
        d="M3.757 3.757 8 8m0 0 4.243 4.243M8 8l-4.243 4.243M8 8l4.243-4.243"
      />
    </svg>
  );
}
