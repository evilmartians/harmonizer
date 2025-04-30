import type { SVGProps } from "react";

export type MLinkProps = SVGProps<SVGSVGElement>;

export function MLink(props: MLinkProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        stroke="currentColor"
        d="m10.5 5.5-5 5m2-2a2.121 2.121 0 0 1 0 3l-1 1a2.121 2.121 0 1 1-3-3l1-1a2.121 2.121 0 0 1 3 0Zm4-1 1-1a2.121 2.121 0 1 0-3-3l-1 1a2.121 2.121 0 1 0 3 3Z"
      />
    </svg>
  );
}
